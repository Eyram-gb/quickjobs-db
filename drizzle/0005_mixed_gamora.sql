ALTER TABLE "messages" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_unique" UNIQUE("id");