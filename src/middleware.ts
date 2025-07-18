import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obtener el token JWT
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/chatNova']
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Rutas a las que no debe acceder si está autenticado
  const restrictedForAuth = ['/login', '/restore']
  if (restrictedForAuth.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// // Configurar qué rutas debe procesar el middleware
// export const config = {
//   matcher: [
//     /*
//      * Ejecutar middleware solo en rutas específicas:
//      * - Rutas protegidas: /dashboard, /chatNova
//      * - Rutas de auth: /login, /restore
//      * - Página principal: /
//      */
//     '/',
//     '/dashboard/:path*',
//     '/chatNova/:path*',
//     '/login',
//     '/restore'
//   ],
// }

export const config = {
  matcher: [
    /*
     * Ejecutar middleware en todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - archivos públicos (imágenes, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}