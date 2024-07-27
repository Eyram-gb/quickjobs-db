import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../models/schema";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);
export const db = drizzle(sql, { schema, logger: true });
