import { bigserial, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { industriesArr } from '../../lib/constants';

const industriesEnum = pgEnum("industries_enum", industriesArr);

export const industries = pgTable("industries", {
  id: bigserial("id", { mode: "number" }).primaryKey().unique(),
  industry_name: industriesEnum("industry_name"),
});