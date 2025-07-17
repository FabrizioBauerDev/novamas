import { auth } from "@/auth"
import { Session } from "next-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth: Session | null }) => {
  const { pathname } = req.nextUrl
  
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard']
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Si es una ruta protegida y no hay sesión, redirigir al login
  if (isProtectedRoute && !req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si está logueado y trata de acceder al login, redirigir al dashboard
  if (pathname === '/login' && req.auth) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return NextResponse.next()
})

// Configurar qué rutas debe procesar el middleware
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