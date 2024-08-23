import { sql, SQL } from "drizzle-orm";
import {
  AnyPgColumn,
  bigserial,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { industries,  } from "./industries";
// import { industriesArr } from "../../lib/constants";

export const userEnum = pgEnum("user_enum", ["admin", "client", "company"]);
export const users = pgTable(
  "users",
  {
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
  },
  (table) => {
    return {
      idIdx: index("id_idx").on(table.id),
      emailIdx: index("email_idx").on(table.email),
    };
  }
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const employer_profile = pgTable(
  "employer_profile",
  {
    id: uuid("id").defaultRandom().primaryKey().unique(),
    user_id: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    name: varchar("name").notNull(),
    description: varchar("description").notNull(),
    logo_url: varchar("logo_url"),
    location: varchar("location"),
    website_url: varchar("website_url"),
    industry_id: bigserial("industry_id", { mode: "number" }).references(
      () => industries.id,
      {
        onDelete: "cascade",
      }
    ),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.id),
      user_idIdx: index("user_id_idx").on(table.user_id),
    };
  }
);

export type EmployerProfile = typeof employer_profile.$inferSelect;
export type NewEmployerProfile = typeof employer_profile.$inferInsert;

export const applicant_profile = pgTable("applicant_profile", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  first_name: varchar("first_name").notNull(),
  last_name: varchar("last_name").notNull(),
  profile_url: varchar("profile_url").notNull(),
  banner_url: varchar("banner_url"),
  other_name: varchar("other_name"),
  bio: varchar("bio"),
  resume_url: varchar("resume_url"),
  skills: varchar("skills"),
  industry_id: bigserial("industry_id", { mode: "number" }).references(
    () => industries.id,
    {
      onDelete: "cascade",
    }
  ),
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

export type ApplicantProfile = typeof applicant_profile.$inferSelect;
export type NewApplicantProfile = typeof applicant_profile.$inferInsert;

export function lower(input: AnyPgColumn): SQL {
  return sql`lower(${input})`;
}
