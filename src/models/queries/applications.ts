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
      application_id: applications.id,
      gig_id: applications.gig_id,
      applicant_id: applications.applicant_id,
      cv_url: applications.cv_url,
      created_at: applications.created_at,
      gig_title: gigs.title,
      gig_description: gigs.description,
      status: applications.application_status,
    })
    .from(applications)
    .innerJoin(gigs, eq(applications.gig_id, gigs.id))
    .where(eq(gigs.employer_id, employerId))
    .orderBy(applications.created_at);
}
