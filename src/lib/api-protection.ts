import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifica que la petición venga desde un origen permitido
 * @param request - La petición de Next.js
 * @returns NextResponse con error si el origen no es válido, null si es válido
 */
export function verifyOrigin(request: NextRequest): NextResponse | null {
  const allowedOrigins = [
    'https://novamas.vercel.app',
    'http://localhost:3000',
    'https://localhost:3000',
  ];

  // Obtener el origin desde los headers
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // En desarrollo, Next.js a veces no envía el header 'origin' en algunas peticiones
  // Por eso también verificamos el referer
  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  // Si no hay origin ni referer, rechazar la petición
  if (!requestOrigin) {
    console.warn('⚠️ Petición sin origin ni referer detectada');
    return NextResponse.json(
      { error: 'Acceso denegado: Origen no especificado' },
      { status: 403 }
    );
  }

  // Verificar si el origin está en la lista de permitidos
  if (!allowedOrigins.includes(requestOrigin)) {
    console.warn(`⚠️ Petición desde origen no permitido: ${requestOrigin}`);
    return NextResponse.json(
      { error: 'Acceso denegado: Origen no autorizado' },
      { status: 403 }
    );
  }

  // Si llegamos acá, el origen es válido
  return null;
}

// Middleware para proteger rutas de API
export async function protectApiRoute(
  request: NextRequest,
  options: {
    requireAuth?: boolean; // Si requiere autenticación
  } = {}
): Promise<NextResponse | null> {
  // 1. Verificar origen
  const originError = verifyOrigin(request);
  if (originError) return originError;

  // 2. Verificar autenticación
  if (options.requireAuth) {
    const { auth } = await import('@/auth');
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado: Debes iniciar sesión' },
        { status: 401 }
      );
    }
  }

  // Si todas las verificaciones pasan, retornar null (permitir la petición)
  return null;
}

/**
 * Headers CORS para respuestas de API
 * @param origin - El origen de la petición
 * @returns Headers con configuración CORS
 */
export function getCorsHeaders(origin: string | null): HeadersInit {
  const allowedOrigins = [
    'https://novamas.vercel.app',
    'http://localhost:3000',
    'https://localhost:3000',
  ];

  // Solo permitir CORS si el origin está en la lista
  if (origin && allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
  }

  return {};
}

/**
 * Maneja peticiones OPTIONS para CORS preflight
 */
export function handleCorsOptions(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
