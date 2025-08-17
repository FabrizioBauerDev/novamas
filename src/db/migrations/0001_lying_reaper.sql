CREATE TYPE "public"."CouldntStopType" AS ENUM('NO', 'NO_ES_SEG', 'SI');--> statement-breakpoint
CREATE TYPE "public"."GenderType" AS ENUM('MASCULINO', 'FEMENINO', 'OTRO');--> statement-breakpoint
CREATE TYPE "public"."PersonalIssuesType" AS ENUM('NO', 'NO_AP', 'SI');--> statement-breakpoint
CREATE TABLE "EvaluationForm" (
	"id" uuid PRIMARY KEY NOT NULL,
	"gender" "GenderType" NOT NULL,
	"age" integer NOT NULL,
	"onlineGaming" boolean NOT NULL,
	"couldntStop" "CouldntStopType" NOT NULL,
	"personalIssues" "PersonalIssuesType" NOT NULL,
	"triedToQuit" boolean NOT NULL,
	"score" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "EvaluationForm" ADD CONSTRAINT "EvaluationForm_id_ChatSession_id_fk" FOREIGN KEY ("id") REFERENCES "public"."ChatSession"("id") ON DELETE cascade ON UPDATE no action;