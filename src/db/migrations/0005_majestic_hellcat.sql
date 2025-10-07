ALTER TABLE "ChatSession" ADD COLUMN "usedGraceMessage" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ChatSession" ADD COLUMN "sessionEndedAt" timestamp;--> statement-breakpoint
ALTER TABLE "ChatSession" ADD COLUMN "maxDurationMs" integer DEFAULT 1200000 NOT NULL;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "chunk" USING hnsw ("embedding" vector_cosine_ops);