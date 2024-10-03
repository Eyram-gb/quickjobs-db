DO $$ BEGIN
 CREATE TYPE "public"."experience" AS ENUM('entry level', 'intermediate', 'expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."schedule" AS ENUM('part-time', 'full-time');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "application_status" ADD VALUE 'reviewing';--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "remote" boolean;--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "experience" "experience";--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "schedule" "schedule";