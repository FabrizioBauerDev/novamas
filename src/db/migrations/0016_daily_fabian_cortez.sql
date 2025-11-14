CREATE TABLE "RAGMetric" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatSessionId" uuid NOT NULL,
	"query" text NOT NULL,
	"llmResponse" text,
	"ragResponse" text NOT NULL,
	"ragRelevance" real NOT NULL,
	"llmUsedRAG" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "RAGMetric" ADD CONSTRAINT "RAGMetric_chatSessionId_ChatSession_id_fk" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE no action ON UPDATE no action;