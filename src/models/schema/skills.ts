import { bigserial, pgTable, varchar } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: bigserial("id", { mode: "number" }).primaryKey().unique(),
  name: varchar("name", { length: 150 }).notNull(),
});
