import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { gigs, TGig } from "../schema/gigs";

export async function findAllGigs() {
  return await db.select().from(gigs);
}

export async function findGigById(id: string) {
  return await db.select().from(gigs).where(eq(gigs.id, id));
}

export async function createGig(gigBody: TGig) {
  return await db.insert(gigs).values(gigBody).returning();
}

export async function editGig(id: string, gigBody: TGig ) {
    return await db.update(gigs).set(gigBody).where(eq(gigs.id, id)).returning();
}

export async function removeGig(id: string) {
  return await db.update(gigs).set({ is_deleted: true }).where(eq(gigs.id, id)).returning();
}