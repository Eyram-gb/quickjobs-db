import { db } from "../../lib/db";
import { NewUser, users } from "../schema";

export async function insertNewUser (user: NewUser) {
     return await db.insert(users).values(user).returning();
     
}