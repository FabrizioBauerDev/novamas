ALTER TABLE "ChatFeedback" DROP CONSTRAINT "ChatFeedback_id_ChatSession_id_fk";
--> statement-breakpoint
ALTER TABLE "ChatFeedback" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "ChatFeedback" ADD COLUMN "chatSessionId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "ChatFeedback" ADD CONSTRAINT "ChatFeedback_chatSessionId_ChatSession_id_fk" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatFeedback" ADD CONSTRAINT "ChatFeedback_chatSessionId_unique" UNIQUE("chatSessionId");