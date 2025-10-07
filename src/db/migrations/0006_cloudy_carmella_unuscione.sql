ALTER TABLE "Message" RENAME COLUMN "sentiment" TO "sentimentLabel";--> statement-breakpoint
ALTER TABLE "ChatSession" ADD COLUMN "analyzed" boolean DEFAULT false NOT NULL;