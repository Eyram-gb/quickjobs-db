import {
  bigserial,
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employer_profile, industries, users } from ".";

export const gigs = pgTable("gigs", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  employer_id: uuid("employer_id").references(() => employer_profile.id, {
    onDelete: "cascade",
  }),
  title: varchar("title"),
  description: varchar("description"),
  duration: varchar("duration"),
  location: varchar("location"),
  budget_range: varchar("budget_range").notNull(),
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
export type TGig = typeof gigs.$inferInsert;
