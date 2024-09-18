import { applications, TNewApplication } from "./../schema/applications";
import { db } from "../../lib/db";
import { gigs } from "../schema";
import { eq } from "drizzle-orm";

export async function insertNewApplication(data: TNewApplication) {
  return db.insert(applications).values(data).returning();
}

export async function findEmployerApplications(employerId: string) {
  return db
    .select({
      gig_id: gigs.id,
      gig_description: gigs.description,
      gig_title: gigs.title,
      cv_url: applications.cv_url,
    })
    .from(gigs)
    .where(eq(gigs.employer_id, employerId))
    .leftJoin(applications, eq(gigs.id, applications.gig_id));
}
