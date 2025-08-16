import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import { vector } from "drizzle-orm/pg-core";

// Tabla de libros
export const bibliography = pgTable("bibliography", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull().unique(),
    author: text("author"),
    description: text("description"),
    createdat: timestamp("createdat", { mode: "date" }).notNull().defaultNow()
});

// Tabla de chunk
export const chunk = pgTable("chunk", {
    id: uuid("id").primaryKey().defaultRandom(),
    resource_id: uuid("resource_id").notNull().references(() => bibliography.id),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 384 }).notNull(), // dimension de los vectores de all-MiniLM-L6-v2
});
