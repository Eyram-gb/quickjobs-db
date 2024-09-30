ALTER TABLE "gigs"
ALTER COLUMN "requirements" TYPE text[] USING requirements::text[];
--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "negotiable" boolean;