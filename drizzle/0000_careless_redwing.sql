DO $$ BEGIN
 CREATE TYPE "public"."user_enum" AS ENUM('admin', 'client', 'company');
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
CREATE TABLE IF NOT EXISTS "gigs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"employer_id" uuid,
	"title" varchar,
	"description" varchar,
	"duration" varchar,
	"location" varchar,
	"budget_range" numeric NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"requirements" text,
	"updated_at" timestamp (0) with time zone,
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "gigs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applicant_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
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
	"logo_url" varchar,
	"location" varchar,
	"website_url" varchar,
	"industry" varchar,
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
CREATE TABLE IF NOT EXISTS "messages" (
	"id" bigserial NOT NULL,
	"sender_id" uuid,
	"recipient_id" uuid,
	"message_text" text NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now(),
	"updated_at" timestamp (0) with time zone
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
