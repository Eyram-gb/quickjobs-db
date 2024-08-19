ALTER TABLE "applicant_profile" ADD COLUMN "industry_id" bigserial NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "industry_id" bigserial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applicant_profile" ADD CONSTRAINT "applicant_profile_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employer_profile" ADD CONSTRAINT "employer_profile_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
