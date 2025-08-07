import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __drizzle: ReturnType<typeof drizzle> | undefined;
}

let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === "production") {
  client = postgres(process.env.DATABASE_URL!);
  db = drizzle(client, { schema });
} else {
  if (!global.__drizzle) {
    client = postgres(process.env.DATABASE_URL!);
    global.__drizzle = drizzle(client, { schema });
  }
  db = global.__drizzle;
}

export { db };
