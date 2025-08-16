CREATE TYPE "public"."SenderType" AS ENUM('assistant', 'user');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('ADMINISTRADOR', 'INVESTIGADOR', 'ESTUDIANTE');--> statement-breakpoint
CREATE TYPE "public"."UserStatus" AS ENUM('ACTIVO', 'DESACTIVADO');--> statement-breakpoint
CREATE TABLE "ChatFeedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChatGroupMember" (
	"userId" uuid NOT NULL,
	"chatGroupId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ChatGroupMember_userId_chatGroupId_pk" PRIMARY KEY("userId","chatGroupId")
);
--> statement-breakpoint
CREATE TABLE "ChatGroup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"password" text NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChatSession" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatGroupId" uuid,
	"chatFeedBackId" uuid,
	"numOfTokensIn" integer,
	"numOfTokensOut" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatSessionId" uuid NOT NULL,
	"sender" "SenderType" NOT NULL,
	"content" text NOT NULL,
	"messageTokens" integer,
	"sentimentScore" real,
	"sentimentLabel" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "UserRole" NOT NULL,
	"status" "UserStatus" DEFAULT 'ACTIVO' NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ChatGroupMember" ADD CONSTRAINT "ChatGroupMember_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatGroupMember" ADD CONSTRAINT "ChatGroupMember_chatGroupId_ChatGroup_id_fk" FOREIGN KEY ("chatGroupId") REFERENCES "public"."ChatGroup"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatGroup" ADD CONSTRAINT "ChatGroup_creatorId_User_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_chatGroupId_ChatGroup_id_fk" FOREIGN KEY ("chatGroupId") REFERENCES "public"."ChatGroup"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_chatFeedBackId_ChatFeedback_id_fk" FOREIGN KEY ("chatFeedBackId") REFERENCES "public"."ChatFeedback"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatSessionId_ChatSession_id_fk" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE no action ON UPDATE no action;