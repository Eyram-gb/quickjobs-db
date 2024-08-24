import { db } from "../../lib/db";
import { industries } from "../schema";

export function findAllIndustries() {
  return db.select().from(industries);
}
