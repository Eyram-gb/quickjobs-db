import { bigserial, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { industriesArr } from '../../lib/constants';

const industriesEnum = pgEnum("industries_enum", industriesArr);

export const industries = pgTable("industries", {
  id: bigserial("id", { mode: "number" }).primaryKey().unique(),
  industry_name: varchar("industry_name"),
});