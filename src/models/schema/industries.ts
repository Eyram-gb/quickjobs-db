import { bigserial, pgTable } from 'drizzle-orm/pg-core';
import { industriesEnum } from './users';

export const industries = pgTable("industries", {
  id: bigserial("id", { mode: "number" }).primaryKey().unique(),
  name: industriesEnum("name").notNull(),
});