import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employer_profile, users } from ".";

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
  budget_range: decimal("budget_range").notNull(),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  requirements: text("requirements"),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  is_active: boolean("is_active").default(true),
  is_deleted: boolean("is_deleted").default(false),
  //   is_featured: boolean("is_featured").default(false),
});
