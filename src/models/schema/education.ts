import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const education = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  institution: varchar("institution").notNull(),
  certificate: varchar("certificate"),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  description: varchar("description"),
  degree_type: varchar("degree_type"),
  field_of_study: varchar("field_of_study"),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});