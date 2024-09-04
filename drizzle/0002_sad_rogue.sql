ALTER TABLE "gigs" ADD COLUMN "negotiable" boolean;--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "industry_id" bigserial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gigs" ADD CONSTRAINT "gigs_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
