CREATE TABLE IF NOT EXISTS "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"institution" varchar NOT NULL,
	"certificate" varchar,
	"start_date" timestamp,
	"end_date" timestamp,
	"description" varchar,
	"degree_type" varchar,
	"field_of_study" varchar,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone,
	CONSTRAINT "education_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "gigs" ALTER COLUMN "budget_range" SET DATA TYPE varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
