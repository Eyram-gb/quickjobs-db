import { employer_profile } from "./../schema/users";
import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { db } from "../../lib/db";
import { gigs, TGig } from "../schema/gigs";
import { applications } from "../schema";

// Define a new type that includes all fields from gigs and logo_url from employer_profile
export type GigWithEmployerLogo = TGig & {
  logo_url: string | null; // Adjust type based on your schema
};

export async function findAllGigs({
  industryId,
  limit,
  jobTypes,
  experienceLevels,
  searchInput, // Added searchInput parameter
}: {
  industryId?: number;
  limit?: number;
  jobTypes?: ["part_time", "full_time", "internship"];
  experienceLevels?: ["entry_level", "intermediate", "expert"];
  searchInput?: string; // Added searchInput type
}) {
  const gig = getTableColumns(gigs);
  const query = db
    .select({
      ...gig,
      company_logo: employer_profile.logo_url,
      company_name: employer_profile.name,
      application_count: sql<number>`cast(count(${applications.id}) as integer)`,
    })
    .from(gigs)
    .innerJoin(employer_profile, eq(employer_profile.id, gigs.employer_id))
    .leftJoin(applications, eq(applications.gig_id, gigs.id))
    .groupBy(gigs.id, employer_profile.logo_url, employer_profile.name);

  const dynamicQuery = query.$dynamic();
  if (industryId) {
    dynamicQuery.where(eq(gigs.industry_id, industryId));
  }

  if (jobTypes && jobTypes.length > 0) {
    dynamicQuery.where(inArray(gigs.schedule, jobTypes));
  }

  if (experienceLevels && experienceLevels.length > 0) {
    dynamicQuery.where(inArray(gigs.experience, experienceLevels));
  }

  if (limit) {
    dynamicQuery.limit(limit);
  }

  if (searchInput) {
    dynamicQuery.where(
      sql`${gigs.title} ILIKE ${`%${searchInput}%`} OR ${gigs.description} ILIKE ${`%${searchInput}%`}`
    ); // Filter by title and description
  }

  const data = await dynamicQuery;
  return data;
}

export async function findGigById(id: string) {
  const gig = getTableColumns(gigs);
  return await db
    .select({
      ...gig,
      company_logo: employer_profile.logo_url,
      company_name: employer_profile.name,
      website: employer_profile.website_url,
      company_bio: employer_profile.description,
    })
    .from(gigs)
    .innerJoin(employer_profile, eq(employer_profile.id, gigs.employer_id))
    .where(eq(gigs.id, id));
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
