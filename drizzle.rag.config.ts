import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/bibliography/schema.ts",
    out: "./src/bibliography/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.RAG_DATABASE_URL!,
    },
});
