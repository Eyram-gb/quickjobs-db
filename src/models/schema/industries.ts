import { bigserial, pgEnum, pgTable } from "drizzle-orm/pg-core";
// import { industriesArr } from '../../lib/constants';

export const industriesEnum = pgEnum("industry_enum", [
  "Marketing and Communications",
  "Banking and Finance",
  "Healthcare and Life Sciences",
  "Education and Research",
  "Entertainment and Media",
  "Environment and Sustainability",
  "Government and Non-Profit",
  "Professional Services",
]);

export const industries = pgTable("industries", {
  id: bigserial("id", { mode: "number" }).primaryKey().unique(),
  name: industriesEnum("name"),
});
