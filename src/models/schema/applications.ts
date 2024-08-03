import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { applicant_profile } from "./users";
import { gigs } from "./gigs";

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  gig_id: uuid("gig_id").references(() => gigs.id, { onDelete: "cascade" }),
  applicant_id: uuid("applicant_id").references(() => applicant_profile.id, {
    onDelete: "cascade",
  }),
  cv_url: uuid("cv_url"),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});
