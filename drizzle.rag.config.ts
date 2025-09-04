import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/rag/schema.ts",
    out: "./src/rag/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.RAG_DB_URL!,
    },
});
