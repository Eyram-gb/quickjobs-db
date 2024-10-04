import { employer_profile } from "./../schema/users";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../lib/db";
import { gigs, TGig } from "../schema/gigs";
import { applications } from "../schema";

// Define a new type that includes all fields from gigs and logo_url from employer_profile
export type GigWithEmployerLogo = TGig & {
  logo_url: string | null; // Adjust type based on your schema
};

export async function findAllGigs({
  industryId,
  // employerId,
  limit,
  // offset,
}: {
  industryId?: number;
  // employerId?: string;
  limit?: number;
  // offset?: number;
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

  // if (employerId) {
  //   dynamicQuery.where(eq(gigs.employer_id, employerId));
  // }

  if (limit) {
    dynamicQuery.limit(limit); 
  }

  // if (offset) {
  //   dynamicQuery.offset(offset);
  // }
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
