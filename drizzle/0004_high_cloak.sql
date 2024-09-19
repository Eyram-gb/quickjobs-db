DO $$ BEGIN
 CREATE TYPE "public"."application_status" AS ENUM('pending', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "application_status" "application_status" DEFAULT 'pending';