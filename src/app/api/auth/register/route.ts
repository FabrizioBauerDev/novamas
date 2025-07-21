import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/prisma/db";
import { signUpSchema } from "@/schema/zodSchemas";

export async function POST(request: NextRequest) {
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

    const { name, email, password } = validatedFields.data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe con este email" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
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
