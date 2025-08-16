import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  // out: process.env.DB_TARGET === 'supabase'
  //   ? './drizzle/migrations_supabase'
  //   : './drizzle/migrations_local',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
