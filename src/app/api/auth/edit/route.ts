import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateUserSchema } from "@/schema/zodSchemas";
import { protectApiRoute } from "@/lib/api-protection";

export async function PUT(request: NextRequest) {
    // Proteger la ruta: verificar origen y autenticación
    const protectionCheck = await protectApiRoute(request, { requireAuth: true });
    if (protectionCheck) return protectionCheck;

    try {
        const body = await request.json();

        // Validar los datos de entrada
        const validatedFields = updateUserSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validatedFields.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const { id, role, status } = validatedFields.data;

        // Verificar si el usuario ya existe
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1)
            .then(result => result[0]);

        if (!existingUser) {
            return NextResponse.json(
                { error: "El usuario no existe" },
                { status: 404 }
            );
        }

        // Actualizar el usuario
        const [user] = await db
            .update(users)
            .set({
                role,
                status,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                status: users.status,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            });

        return NextResponse.json(
            {
                message: "Usuario modificado exitosamente",
                user
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error al modificar usuario:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
