ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_chatFeedBackId_ChatFeedback_id_fk";
--> statement-breakpoint
ALTER TABLE "ChatFeedback" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ChatFeedback" ADD CONSTRAINT "ChatFeedback_id_ChatSession_id_fk" FOREIGN KEY ("id") REFERENCES "public"."ChatSession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatSession" DROP COLUMN "chatFeedBackId";