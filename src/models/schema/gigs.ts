import {
  bigserial,
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employer_profile, industries, users } from ".";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const experienceEnum = pgEnum("experience", ["entry_level", "intermediate", "expert"]);
export const scheduleEnum = pgEnum("schedule", ["part_time", "full_time", 'internship']);

export const gigs = pgTable("gigs", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  employer_id: uuid("employer_id").references(() => employer_profile.id, {
    onDelete: "cascade",
  }),
  title: varchar("title"),
  description: varchar("description"),
  duration: varchar("duration"),
  location: jsonb("location").$type<{
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    lat: number;
    long: number;
  }>(),
  budget_range: varchar("budget_range"),
  remote: boolean("remote"),
  experience: experienceEnum("experience"),
  schedule: scheduleEnum("schedule"),
  negotiable: boolean("negotiable"),
  requirements: text("requirements").array(),
  industry_id: bigserial("industry_id", { mode: "number" }).references(
    () => industries.id,
    {
      onDelete: "cascade",
    }
  ),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  is_active: boolean("is_active").default(true),
  is_deleted: boolean("is_deleted").default(false),
  //   is_featured: boolean("is_featured").default(false),
});
export const InsertGigSchema = createInsertSchema(gigs, {
  negotiable: z.string(),
  remote: z.string(),
});
export type TGig = typeof gigs.$inferInsert;
