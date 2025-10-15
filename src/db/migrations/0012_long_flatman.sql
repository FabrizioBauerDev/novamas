CREATE TYPE "public"."sentimentLabelType" AS ENUM('POS', 'NEG', 'NEU');--> statement-breakpoint
CREATE TABLE "FinalForm" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"assistantDesign" integer NOT NULL,
	"assistantPurpose" integer NOT NULL,
	"assistantResponses" integer NOT NULL,
	"userFriendly" integer NOT NULL,
	"usefulToUnderstandRisks" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "hate_speech_percentage" TO "hate_speech";--> statement-breakpoint
ALTER TABLE "statistics" RENAME COLUMN "ironic_percentage" TO "ironic";--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "sentimentLabel" SET DATA TYPE "public"."sentimentLabelType" USING "sentimentLabel"::"public"."sentimentLabelType";--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "chat_group_id" uuid;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "positive_percentage" real NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "negative_percentage" real NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "neutral_percentage" real NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "most_frequent_sentiment" "sentimentLabelType" NOT NULL;--> statement-breakpoint
ALTER TABLE "FinalForm" ADD CONSTRAINT "FinalForm_chatId_ChatSession_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."ChatSession"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_chat_group_id_ChatGroup_id_fk" FOREIGN KEY ("chat_group_id") REFERENCES "public"."ChatGroup"("id") ON DELETE no action ON UPDATE no action;