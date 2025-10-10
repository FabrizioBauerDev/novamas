import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
  real,
  boolean,
  primaryKey,
  vector, index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Definición de enums
export const userRoleEnum = pgEnum("UserRole", ["ADMINISTRADOR", "INVESTIGADOR", "ESTUDIANTE"]);
export const userStatusEnum = pgEnum("UserStatus", ["ACTIVO", "DESACTIVADO"]);
export const senderTypeEnum = pgEnum("SenderType", ["assistant", "user"]);
export const genderTypeEnum = pgEnum("GenderType", ["MASCULINO", "FEMENINO", "OTRO"]);
export const couldntStopTypeEnum = pgEnum("CouldntStopType", ["NO", "NO_ES_SEG", "SI"]);
export const personalIssuesTypeEnum = pgEnum("PersonalIssuesType", ["NO", "NO_AP", "SI"]);

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

// Tabla ChatSession
export const chatSessions = pgTable("ChatSession", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatGroupId: uuid("chatGroupId").references(() => chatGroups.id),
  numOfTokensIn: integer("numOfTokensIn"),
  numOfTokensOut: integer("numOfTokensOut"),
  usedGraceMessage: boolean("usedGraceMessage").notNull().default(false),
  sessionEndedAt: timestamp("sessionEndedAt", { mode: "date" }),
  maxDurationMs: integer("maxDurationMs").notNull().default(1200000), // 20 minutos en milisegundos
  analyzed: boolean("analyzed").notNull().default(false),
  ...timestamps,
});

// Tabla ChatFeedback (relación 1:1 con ChatSession)
export const chatFeedbacks = pgTable("ChatFeedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatSessionId: uuid("chatSessionId").notNull().unique().references(() => chatSessions.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// Tabla Message
export const messages = pgTable("Message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatSessionId: uuid("chatSessionId").notNull().references(() => chatSessions.id),
  sender: senderTypeEnum("sender").notNull(),
  content: text("content").notNull(),
  messageTokensIn: integer("messageTokensIn"),
  messageTokensOut: integer("messageTokensOut"),
  messageTokensReasoning: integer("messageTokensReasoning"),
  sentimentLabel: text("sentimentLabel"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
}, (table) => ({
  // Índice compuesto optimizado para consultas frecuentes
  // Usado en: getChatMessagesAction, saveChat, verificaciones de mensajes
  sessionCreatedIdx: index("idx_messages_session_created")
    .on(table.chatSessionId, table.createdAt.desc()),
  // Índice simple para búsquedas por sesión (backup/alternativo)
  sessionIdIdx: index("idx_messages_session_id").on(table.chatSessionId),
}));

// Tabla EvaluationForm
export const evaluationForms = pgTable("EvaluationForm", {
  id: uuid("id").primaryKey().references(() => chatSessions.id, { onDelete: "cascade" }),
  gender: genderTypeEnum("gender").notNull(),
  age: integer("age").notNull(),
  onlineGaming: boolean("onlineGaming").notNull(),
  couldntStop: couldntStopTypeEnum("couldntStop").notNull(),
  personalIssues: personalIssuesTypeEnum("personalIssues").notNull(),
  triedToQuit: boolean("triedToQuit").notNull(),
  score: integer("score").notNull(),
  ip: text("ip"),
  address: text("address"),
  ...timestamps,
});

// Tabla GeoLocation (relación 1:1 con EvaluationForm)
export const geoLocations = pgTable("GeoLocation", {
  id: uuid("id").primaryKey().defaultRandom(),
  evaluationFormId: uuid("evaluationFormId").notNull().unique().references(() => evaluationForms.id, { onDelete: "cascade" }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// Definición de relaciones
export const usersRelations = relations(users, ({ many }) => ({
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
    fields: [chatSessions.id],
    references: [chatFeedbacks.chatSessionId],
  }),
  messages: many(messages),
  evaluationForm: one(evaluationForms, {
    fields: [chatSessions.id],
    references: [evaluationForms.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [messages.chatSessionId],
    references: [chatSessions.id],
  }),
}));

export const chatFeedbacksRelations = relations(chatFeedbacks, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [chatFeedbacks.chatSessionId],
    references: [chatSessions.id],
  }),
}));

export const evaluationFormsRelations = relations(evaluationForms, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [evaluationForms.id],
    references: [chatSessions.id],
  }),
  geoLocation: one(geoLocations, {
    fields: [evaluationForms.id],
    references: [geoLocations.evaluationFormId],
  }),
}));

export const geoLocationsRelations = relations(geoLocations, ({ one }) => ({
  evaluationForm: one(evaluationForms, {
    fields: [geoLocations.evaluationFormId],
    references: [evaluationForms.id],
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

export type EvaluationForm = typeof evaluationForms.$inferSelect;
export type NewEvaluationForm = typeof evaluationForms.$inferInsert;

export type GeoLocation = typeof geoLocations.$inferSelect;
export type NewGeoLocation = typeof geoLocations.$inferInsert;

// ================================================================================================
// ========================== ESQUEMA RAG - BIBLIOGRAFÍA Y VECTORES =============================
// ================================================================================================

export const bibliographyCategoryEnum = pgEnum("BibliographyCategory", [
  "ESTADISTICAS",
  "NUMERO_TELEFONO",
  "TECNICAS_CONTROL",
  "OTRO",
]);


// Tabla de libros/bibliografía
export const bibliography = pgTable("bibliography", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull().unique(),
  author: text("author"),
  description: text("description"),
  category: bibliographyCategoryEnum("category").notNull().default("OTRO"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow()
});

// Tabla de chunks con embeddings vectoriales
export const chunk = pgTable("chunk", {
  id: uuid("id").primaryKey().defaultRandom(),
  resource_id: uuid("resource_id").notNull().references(() => bibliography.id),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 768 }).notNull(), // dimension de los vectores de all-MiniLM-L6-v2
},(table) => [
  index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
]
);

// Relaciones RAG
export const bibliographyRelations = relations(bibliography, ({ many }) => ({
  chunks: many(chunk),
}));

export const chunkRelations = relations(chunk, ({ one }) => ({
  bibliography: one(bibliography, {
    fields: [chunk.resource_id],
    references: [bibliography.id],
  }),
}));

// Tipos TypeScript para RAG
export type Bibliography = typeof bibliography.$inferSelect;
export type NewBibliography = typeof bibliography.$inferInsert;

export type Chunk = typeof chunk.$inferSelect;
export type NewChunk = typeof chunk.$inferInsert;


// ================================================================================================
// ========================== ESQUEMA ESTADISTICAS =============================
// ================================================================================================

export const BetTypeEnum = pgEnum("BetType", [
  "CASINO_PRESENCIAL",
  "CASINO_ONLINE",
  "DEPORTIVA",
  "LOTERIA",
  "VIDEOJUEGO",
  "NO_ESPECIFICA",
]);

export const statistics = pgTable("statistics", {
  id: uuid("id").primaryKey().defaultRandom(),
  summary: text("summary").notNull(),
  chatId: uuid("chat_id").notNull().references(() => chatSessions.id),
  amountMessages: integer("amount_messages").notNull(),
  minWordsPerMessage: integer("min_words_per_message").notNull(),
  maxWordsPerMessage: integer("max_words_per_message").notNull(),
  hateSpeechPercentage: real("hate_speech_percentage").notNull(),
  ironicPercentage: real("ironic_percentage").notNull(),
  changeTheme: boolean("change_theme").notNull(),
  betType: BetTypeEnum("bet_type").notNull().default("NO_ESPECIFICA"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow()
});

export const statisticsRelations = relations(statistics, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [statistics.chatId],
    references: [chatSessions.id],
  }),
}));

export type Statistic = typeof statistics.$inferSelect;
export type NewStatistic = typeof statistics.$inferInsert;