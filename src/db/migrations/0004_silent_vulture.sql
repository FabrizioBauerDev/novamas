CREATE TYPE "public"."BetType" AS ENUM('CASINO_PRESENCIAL', 'CASINO_ONLINE', 'DEPORTIVA', 'LOTERIA', 'VIDEOJUEGO', 'NO_ESPECIFICA');--> statement-breakpoint
CREATE TYPE "public"."BibliographyCategory" AS ENUM('ESTADISTICAS', 'NUMERO_TELEFONO', 'TECNICAS_CONTROL', 'OTRO');--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"summary" text,
	"chat_id" uuid NOT NULL,
	"amount_messages" integer NOT NULL,
	"min_words_per_message" integer NOT NULL,
	"max_words_per_message" integer NOT NULL,
	"hate_speech_percentage" real NOT NULL,
	"ironic_percentage" real NOT NULL,
	"change_theme" boolean NOT NULL,
	"bet_type" "BetType" DEFAULT 'NO_ESPECIFICA' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Message" RENAME COLUMN "sentimentLabel" TO "sentiment";--> statement-breakpoint
ALTER TABLE "bibliography" ADD COLUMN "category" "BibliographyCategory" DEFAULT 'OTRO' NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_chat_id_ChatSession_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."ChatSession"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" DROP COLUMN "sentimentScore";