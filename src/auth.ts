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
        console.log(process.env.emailTest);
        const email = process.env.emailTest;
        const password = process.env.passwordTest;

        if (!credentials || credentials.email !== email || credentials.password !== password) {
          // throw new Error("Credenciales inválidas");
          return null; // No se encontró el usuario
        }

        return { email, password };
      },
    }),
  ],
})