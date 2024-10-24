DO $$ BEGIN
 CREATE TYPE "public"."notification_enum" AS ENUM('chats', 'application_status');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"message" text NOT NULL,
	"type" "notification_enum" NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone,
	CONSTRAINT "notifications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
