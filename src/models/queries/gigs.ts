import { eq, sql } from "drizzle-orm";
import { db } from "../../lib/db";
import { gigs, TGig } from "../schema/gigs";
import { applications, employer_profile } from "../schema";

// Define a new type that includes all fields from gigs and logo_url from employer_profile
export type GigWithEmployerLogo = TGig & {
  logo_url: string | null; // Adjust type based on your schema
};

export async function findAllGigs() {
  return await db
    .select({
      id: gigs.id,
      user_id: gigs.user_id,
      employer_id: gigs.employer_id,
      title: gigs.title,
      description: gigs.description,
      duration: gigs.duration,
      location: gigs.location,
      budget_range: gigs.budget_range,
      requirements: gigs.requirements,
      industry_id: gigs.industry_id,
      created_at: gigs.created_at,
      schedule: gigs.schedule,
      experience: gigs.experience,
      remote: gigs.remote,
      updated_at: gigs.updated_at,
      is_active: gigs.is_active,
      is_deleted: gigs.is_deleted,
      company_logo: employer_profile.logo_url,
      company_name: employer_profile.name,
      application_count: sql<number>`cast(count(${applications.id}) as integer)`,
    })
    .from(gigs)
    .innerJoin(employer_profile, eq(employer_profile.id, gigs.employer_id))
    .leftJoin(applications, eq(applications.gig_id, gigs.id))
    .groupBy(gigs.id, employer_profile.logo_url, employer_profile.name);
}

export async function findGigById(id: string) {
  return await db.select().from(gigs).where(eq(gigs.id, id));
}

export async function createGig(gigBody: TGig) {
  return await db.insert(gigs).values(gigBody).returning();
}

export async function editGig(id: string, gigBody: TGig) {
  return await db.update(gigs).set(gigBody).where(eq(gigs.id, id)).returning();
}

export async function removeGig(id: string) {
  return await db
    .update(gigs)
    .set({ is_deleted: true })
    .where(eq(gigs.id, id))
    .returning();
}

export async function findGigsByEmployerId(id: string) {
  return await db.select().from(gigs).where(eq(gigs.employer_id, id));
}
