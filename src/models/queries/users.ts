import {
  applicant_profile,
  ApplicantProfile,
  employer_profile,
  EmployerProfile,
  NewApplicantProfile,
  NewEmployerProfile,
} from "./../schema/users";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../../lib/db";
import { lower, NewUser, users } from "../schema";

export async function insertNewUser(user: NewUser) {
  return await db.insert(users).values(user).returning();
}

export async function findUserByEmail(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}
export async function emailFound(email: string) {
  return (
    (
      await db
        .select()
        .from(users)
        .where(eq(lower(users.email), email.toLowerCase()))
    ).length > 0
  );
}
export async function findAllUsers() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...rest } = getTableColumns(users); // remove password from data being returned
  return await db.select({ ...rest }).from(users);
}

export async function findAllApplicants() {
  return await db.select().from(users).where(eq(users.user_type, "client"));
}
export async function findAllEmployers() {
  return await db.select().from(users).where(eq(users.user_type, "company"));
}
export async function findUserById(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...rest } = getTableColumns(users); // remove password from data being returned
  return await db
    .select({ ...rest })
    .from(users)
    .where(eq(users.id, id));
}

export async function insertNewApplicantProfile(
  applicantProfile: NewApplicantProfile
) {
  return await db
    .insert(applicant_profile)
    .values(applicantProfile)
    .returning();
}
export async function insertNewEmployerProfile(
  employerProfile: NewEmployerProfile
) {
  return await db.insert(employer_profile).values(employerProfile).returning();
}

export async function modifyApplicantProfile(
  applicantProfile: ApplicantProfile
) {
  return await db
    .update(users)
    .set(applicantProfile)
    .where(eq(users.id, applicantProfile.id))
    .returning();
}
export async function modifyEmployerProfile(employerProfile: EmployerProfile) {
  return await db
    .update(users)
    .set(employerProfile)
    .where(eq(users.id, employerProfile.id))
    .returning();
}
