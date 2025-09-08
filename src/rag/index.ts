import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

if (!process.env.RAG_DB_URL) {
throw new Error("La variable de entorno RAG_DB_URL no está configurada. Por favor, verifica tu archivo .env.local.");
}

const sql = neon(process.env.RAG_DB_URL);
export const db = drizzle({ client: sql });