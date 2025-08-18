ALTER TABLE "Message" RENAME COLUMN "messageTokens" TO "messageTokensOut";--> statement-breakpoint
ALTER TABLE "Message" ADD COLUMN "messageTokensIn" integer;--> statement-breakpoint
ALTER TABLE "Message" ADD COLUMN "messageTokensReasoning" integer;