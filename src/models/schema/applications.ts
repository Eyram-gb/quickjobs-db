import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { applicant_profile } from "./users";
import { gigs } from "./gigs";

export const applicationStatusEnum = pgEnum("application_status", ["pending", "accepted", "rejected"]);

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  gig_id: uuid("gig_id").references(() => gigs.id, { onDelete: "cascade" }),
  applicant_id: uuid("applicant_id").references(() => applicant_profile.id, {
    onDelete: "cascade",
  }),
  cv_url: varchar("cv_url"),
  application_status: applicationStatusEnum("application_status").default("pending"),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

export type TNewApplication = typeof applications.$inferInsert;
export type TApplication = typeof applications.$inferSelect;
