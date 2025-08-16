import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  pgEnum,
  integer,
  real,
  primaryKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Definición de enums
export const userRoleEnum = pgEnum("UserRole", ["ADMINISTRADOR", "INVESTIGADOR", "ESTUDIANTE"]);
export const userStatusEnum = pgEnum("UserStatus", ["ACTIVO", "DESACTIVADO"]);
export const senderTypeEnum = pgEnum("SenderType", ["assistant", "user"]);

// Definición de campos de timestamps reutilizables
const timestamps = {
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
}

// Tabla User
export const users = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull(),
  status: userStatusEnum("status").notNull().default("ACTIVO"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  ...timestamps,
});

// Tabla ChatGroup
export const chatGroups = pgTable("ChatGroup", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creatorId").notNull().references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  password: text("password").notNull(),
  startDate: timestamp("startDate", { mode: "date" }).notNull(),
  endDate: timestamp("endDate", { mode: "date" }).notNull(),
  ...timestamps,
});

// Tabla ChatGroupMember (tabla pivote)
export const chatGroupMembers = pgTable("ChatGroupMember", {
  userId: uuid("userId").notNull().references(() => users.id),
  chatGroupId: uuid("chatGroupId").notNull().references(() => chatGroups.id),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.chatGroupId] })
}));

// Tabla ChatFeedback
export const chatFeedbacks = pgTable("ChatFeedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// Tabla ChatSession
export const chatSessions = pgTable("ChatSession", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatGroupId: uuid("chatGroupId").references(() => chatGroups.id),
  chatFeedBackId: uuid("chatFeedBackId").references(() => chatFeedbacks.id),
  numOfTokensIn: integer("numOfTokensIn"),
  numOfTokensOut: integer("numOfTokensOut"),
  ...timestamps,
});

// Tabla Message
export const messages = pgTable("Message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatSessionId: uuid("chatSessionId").notNull().references(() => chatSessions.id),
  sender: senderTypeEnum("sender").notNull(),
  content: text("content").notNull(),
  messageTokens: integer("messageTokens"),
  sentimentScore: real("sentimentScore"),
  sentimentLabel: text("sentimentLabel"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// Definición de relaciones
export const usersRelations = relations(users, ({ many, one }) => ({
  createdChatGroups: many(chatGroups),
  chatGroupMemberships: many(chatGroupMembers),
}));

export const chatGroupsRelations = relations(chatGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [chatGroups.creatorId],
    references: [users.id],
  }),
  members: many(chatGroupMembers),
  chatSessions: many(chatSessions),
}));

export const chatGroupMembersRelations = relations(chatGroupMembers, ({ one }) => ({
  user: one(users, {
    fields: [chatGroupMembers.userId],
    references: [users.id],
  }),
  chatGroup: one(chatGroups, {
    fields: [chatGroupMembers.chatGroupId],
    references: [chatGroups.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  chatGroup: one(chatGroups, {
    fields: [chatSessions.chatGroupId],
    references: [chatGroups.id],
  }),
  feedback: one(chatFeedbacks, {
    fields: [chatSessions.chatFeedBackId],
    references: [chatFeedbacks.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [messages.chatSessionId],
    references: [chatSessions.id],
  }),
}));

export const chatFeedbacksRelations = relations(chatFeedbacks, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [chatFeedbacks.id],
    references: [chatSessions.chatFeedBackId],
  }),
}));

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ChatGroup = typeof chatGroups.$inferSelect;
export type NewChatGroup = typeof chatGroups.$inferInsert;

export type ChatGroupMember = typeof chatGroupMembers.$inferSelect;
export type NewChatGroupMember = typeof chatGroupMembers.$inferInsert;

export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type ChatFeedback = typeof chatFeedbacks.$inferSelect;
export type NewChatFeedback = typeof chatFeedbacks.$inferInsert;