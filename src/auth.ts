import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { signInSchema } from "./schema/zodSchemas";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Correo electrónico",
          type: "email",
          placeholder: "tu@email.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(credentials) {
        const logString = "Auth.ts | "
        const validatedFields = signInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          console.log(logString + "Credenciales invalidas");
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, validatedFields.data.email))
          .limit(1)
          .then((result) => result[0]);

        if (!user || !user.password) return null;

        // Verificar que el usuario esté activo
        if (user.status !== "ACTIVO") {
          console.log(logString + "Cuenta de usuario desactivada");
          return null;
        }

        const isValid = await compare(
          validatedFields.data.password,
          user.password
        );
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // En el primer login, guardar el id del usuario en el token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      // Si se llama a update() desde el cliente, actualizar el token con los nuevos datos
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.role = session.user.role;
        token.picture = session.user.image;
      }

      // En cada request subsiguiente, validar con la BD
      if (token.id) {
        const dbUser = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            status: users.status,
          })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1)
          .then((result) => result[0]);

        // Si el usuario no existe o está inactivo, invalidar el token
        if (!dbUser || dbUser.status !== "ACTIVO") {
          return null; // Esto forzará el logout
        }

        // Actualizar el token con los datos frescos de la BD
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      // Si el token es null o inválido, retornar una sesión vacía
      if (!token || !token.id) {
        return {
          ...session,
          user: undefined,
          expires: new Date(0).toISOString(), // Marcar como expirada
        };
      }

      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
});
