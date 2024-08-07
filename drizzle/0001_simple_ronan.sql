CREATE INDEX IF NOT EXISTS "name_idx" ON "employer_profile" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "employer_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");