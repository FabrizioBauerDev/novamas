import NextAuth from "next-auth"
import Credentials  from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Correo electrónico", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {

        const email = process.env.EMAIL_TEST;
        const password = process.env.PASSWORD_TEST;

        if (!credentials || credentials.email !== email || credentials.password !== password) {
          // throw new Error("Credenciales inválidas");
          return null; // No se encontró el usuario
        }

        return { email, password };
      },
    }),
  ],
})