import { NextRequest, NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/api-protection";
import axios from "axios";

export async function POST(request: NextRequest) {
    // Proteger la ruta: verificar origen y autenticación
    const protectionCheck = await protectApiRoute(request, { requireAuth: true });
    if (protectionCheck) return protectionCheck;

    try {
        // Llamada a la API FastAPI
        const response = await axios.post("http://190.122.236.149:8000/stats", {});

        // Devolver la respuesta de FastAPI al cliente
        return NextResponse.json(response.data);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Error agregando estadísticas" },
            { status: 500 }
        );
    }
}
