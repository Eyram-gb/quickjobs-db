import { applications, TNewApplication } from "./../schema/applications";
import { db } from "../../lib/db";

export async function insertNewApplication(data:TNewApplication) {
  return db.insert(applications).values(data).returning();
}
