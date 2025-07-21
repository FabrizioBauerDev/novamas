import NextAuth from "next-auth";
import Credentials  from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { signInSchema } from "./schema/zodSchemas";
import { prisma } from "@/prisma/db";
import { compare } from "bcrypt";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 días
    maxAge: 12 * 60 * 60, // 12 horas
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Correo electrónico", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {

        const validatedFields = signInSchema.safeParse(credentials)

        if (!validatedFields.success) {
          console.log('Auth.ts | Invalid credentials');
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: validatedFields.data.email,
          },
        })

        if (!user || !user.password) return null;

        const isValid = await compare(validatedFields.data.password, user.password);
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
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
})