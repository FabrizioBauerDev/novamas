CREATE TABLE "GeoLocation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluationFormId" uuid NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"accuracy" real,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "GeoLocation_evaluationFormId_unique" UNIQUE("evaluationFormId")
);
--> statement-breakpoint
ALTER TABLE "EvaluationForm" ADD COLUMN "ip" text;--> statement-breakpoint
ALTER TABLE "EvaluationForm" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "GeoLocation" ADD CONSTRAINT "GeoLocation_evaluationFormId_EvaluationForm_id_fk" FOREIGN KEY ("evaluationFormId") REFERENCES "public"."EvaluationForm"("id") ON DELETE cascade ON UPDATE no action;