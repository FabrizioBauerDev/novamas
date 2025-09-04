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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
