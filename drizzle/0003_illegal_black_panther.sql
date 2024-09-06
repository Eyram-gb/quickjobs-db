ALTER TABLE "applications" ALTER COLUMN "cv_url" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "gigs" DROP COLUMN IF EXISTS "negotiable";