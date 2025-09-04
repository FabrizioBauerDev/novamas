import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 30, // 60 segundos * 30 = 30 minutos
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      // Rutas protegidas que requieren autenticación
      // (pueden ser exactas o prefijos)
      const protectedRoutes = ['/dashboard', '/chatNova', '/register'];
      const isProtectedRoute = protectedRoutes.some(route =>
        route.endsWith('/') ? pathname.startsWith(route) : pathname === route || pathname.startsWith(route + '/')
      );
      
      // Rutas a las que no debe acceder si está autenticado
      const isOnLogin = pathname === '/login';
      const isOnRestore = pathname === '/restore';
      const isRestrictedForAuth = isOnLogin || isOnRestore;
      
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
