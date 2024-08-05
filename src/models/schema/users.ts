import { sql, SQL } from "drizzle-orm";
import { AnyPgColumn, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userEnum = pgEnum("user_enum", ["admin", "client", "company"]);
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  email: varchar("email").unique().notNull(),
  password_hash: varchar("password_hash").notNull(),
  user_type: userEnum("user_type").notNull(),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const employer_profile = pgTable("employer_profile", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  logo_url: varchar("logo_url"),
  location: varchar("location"),
  website_url: varchar("website_url"),
  industry: varchar("industry"),
});

export const applicant_profile = pgTable("applicant_profile", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  first_name: varchar("first_name").notNull(),
  last_name: varchar("last_name").notNull(),
  bio: varchar("bio"),
  resume_url: varchar("resume_url"),
  skills: varchar("skills"),
  location: varchar("location"),
  education: varchar("education"),
  experience: varchar("experience"),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

export function lower(input: AnyPgColumn): SQL {
  return sql`lower(${input})`;
}