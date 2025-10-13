import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signUpSchema } from "@/schema/zodSchemas";
import { protectApiRoute } from "@/lib/api-protection";

export async function POST(request: NextRequest) {
  // Proteger la ruta: verificar origen y autenticación
  const protectionCheck = await protectApiRoute(request, { requireAuth: true });
  if (protectionCheck) return protectionCheck;

  try {
    const body = await request.json();
    
    // Validar los datos de entrada
    const validatedFields = signUpSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { 
          error: "Datos inválidos", 
          details: validatedFields.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validatedFields.data;

    // Verificar si el usuario ya existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then(result => result[0]);

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe con este email" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Crear el usuario
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
        // status tiene valor por defecto 'ACTIVO' en el esquema
        // emailVerified será null hasta que se verifique
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      });

    return NextResponse.json(
      { 
        message: "Usuario creado exitosamente",
        user 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
