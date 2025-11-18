import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 10, // 60 segundos * 10 = 10 minutos
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      // Rutas protegidas que requieren autenticación (rutas en inSesion)
      // (pueden ser exactas o prefijos)
      const protectedRoutes = [
        '/bibliography',
        '/chatgroup',
        '/dashboard',
        '/profile',
        '/statistics',
        '/usermanagement'
      ];
      const isProtectedRoute = protectedRoutes.some(route =>
        route.endsWith('/') ? pathname.startsWith(route) : pathname === route || pathname.startsWith(route + '/')
      );
      
      // Rutas a las que no debe acceder si está autenticado
      const isOnLogin = pathname === '/login';
      const isRestrictedForAuth = isOnLogin;
      
      // Si está en una ruta protegida
      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirige a login automáticamente
      }
      
      // Si está autenticado y trata de acceder a login/restore
      if (isRestrictedForAuth && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      // Permitir acceso a todas las demás rutas
      return true;
    },
  },
  providers: [], // Se llena en auth.ts
} satisfies NextAuthConfig;
