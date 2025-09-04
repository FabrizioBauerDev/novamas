import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __drizzle: ReturnType<typeof drizzle> | undefined;
}

// Create a Postgres client from the DATABASE_URL environment variable.
// Using the `postgres` client (postgres-js) lets Drizzle use transactions,
// which `neon-http` doesn't support.
const client = postgres(process.env.DATABASE_URL!);
let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === "production") {
  db = drizzle(client, { schema });
} else {
  if (!global.__drizzle) {
    global.__drizzle = drizzle(client, { schema });
  }
  db = global.__drizzle;
}

export { db };
