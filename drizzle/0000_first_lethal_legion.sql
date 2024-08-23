DO $$ BEGIN
 CREATE TYPE "public"."user_enum" AS ENUM('admin', 'client', 'company');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."industry_enum" AS ENUM('Marketing and Communications', 'Banking and Finance', 'Healthcare and Life Sciences', 'Education and Research', 'Entertainment and Media', 'Environment and Sustainability', 'Government and Non-Profit', 'Professional Services');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gig_id" uuid,
	"applicant_id" uuid,
	"cv_url" uuid,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone,
	CONSTRAINT "applications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "gigs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"employer_id" uuid,
	"title" varchar,
	"description" varchar,
	"duration" varchar,
	"location" varchar,
	"budget_range" varchar NOT NULL,
	"requirements" text,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone,
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "gigs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applicant_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"profile_url" varchar NOT NULL,
	"banner_url" varchar,
	"other_name" varchar,
	"bio" varchar,
	"resume_url" varchar,
	"skills" varchar,
	"location" varchar,
	"education" varchar,
	"experience" varchar,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone,
	CONSTRAINT "applicant_profile_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employer_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"logo_url" varchar,
	"location" varchar,
	"website_url" varchar,
	CONSTRAINT "employer_profile_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"user_type" "user_enum" NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" bigserial NOT NULL,
	"reviewer_id" uuid,
	"reviewed_id" uuid,
	"gig_id" uuid,
	"rating" smallint DEFAULT 5,
	"review_text" text,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "industries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" "industry_enum",
	CONSTRAINT "industries_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" bigserial NOT NULL,
	"sender_id" uuid,
	"recipient_id" uuid,
	"message_text" text NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	CONSTRAINT "skills_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_applicant_profile_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant_profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gigs" ADD CONSTRAINT "gigs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gigs" ADD CONSTRAINT "gigs_employer_id_employer_profile_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."employer_profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applicant_profile" ADD CONSTRAINT "applicant_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employer_profile" ADD CONSTRAINT "employer_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewed_id_users_id_fk" FOREIGN KEY ("reviewed_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "employer_profile" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "employer_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");