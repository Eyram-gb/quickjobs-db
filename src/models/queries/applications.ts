import { applications, TNewApplication } from "./../schema/applications";
import { db } from "../../lib/db";
import { applicant_profile, gigs, users } from "../schema";
import { and, eq } from "drizzle-orm";

export async function insertNewApplication(data: TNewApplication) {
  return db.insert(applications).values(data).returning();
}

export async function findEmployerApplications(
  employerId: string,
  gigId?: string
) {
  return db
    .select({
      application_id: applications.id,
      gig_id: applications.gig_id,
      applicant_id: applications.applicant_id,
      cv_url: applications.cv_url,
      user_id: users.id,
      first_name: applicant_profile.first_name,
      last_name: applicant_profile.last_name,
      email: users.email,
      created_at: applications.created_at,
      gig_title: gigs.title,
      gig_description: gigs.description,
      status: applications.application_status,
    })
    .from(applications)
    .innerJoin(gigs, eq(applications.gig_id, gigs.id))
    .leftJoin(
      applicant_profile,
      eq(applications.applicant_id, applicant_profile.id)
    )
    .leftJoin(users, eq(applicant_profile.user_id, users.id))
    .where(
      // modifying query if there is gigId
      !gigId
        ? eq(gigs.employer_id, employerId)
        : and(eq(gigs.employer_id, employerId), eq(applications.gig_id, gigId))
    )
    .orderBy(applications.created_at);
}

export async function editApplicationStatus(
  applicationId: string,
  status: "pending" | "accepted" | "rejected"
) {
  return await db
    .update(applications)
    .set({ application_status: status })
    .where(eq(applications.id, applicationId))
    .returning();
}
