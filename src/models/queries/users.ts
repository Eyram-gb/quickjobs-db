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
 export async function findUserById(id: string) {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { password_hash, ...rest } = getTableColumns(users); // remove password from data being returned
   return await db
     .select({ ...rest })
     .from(users)
     .where(eq(users.id, id));
 }