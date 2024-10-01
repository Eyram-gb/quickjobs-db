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
export async function findApplicantByUserId(userId: string) {
  return await db
    .select()
    .from(applicant_profile)
    .where(eq(applicant_profile.user_id, userId));
}
export async function findEmployerByUserId(userId: string) {
  return await db
    .select()
    .from(employer_profile)
    .where(eq(employer_profile.user_id, userId));
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
  applicantProfile: ApplicantProfile,
  applicantId: string
) {
  return await db
    .update(applicant_profile)
    .set(applicantProfile)
    .where(eq(applicant_profile.id, applicantId))
    .returning();
}
export async function modifyEmployerProfile(
  employerProfile: EmployerProfile,
  employerId: string
) {
  return await db
    .update(employer_profile)
    .set(employerProfile)
    .where(eq(employer_profile.id, employerId))
    .returning();
}
