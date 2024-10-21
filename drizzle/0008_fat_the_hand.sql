ALTER TYPE "experience" ADD VALUE 'entry_level';--> statement-breakpoint
ALTER TYPE "schedule" ADD VALUE 'part_time';--> statement-breakpoint
ALTER TYPE "schedule" ADD VALUE 'full_time';--> statement-breakpoint
ALTER TYPE "schedule" ADD VALUE 'internship';--> statement-breakpoint
ALTER TABLE "gigs" ALTER COLUMN "budget_range" DROP NOT NULL;