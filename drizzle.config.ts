import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/models/schema/*",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.QUICKJOBS_DATABASE_URL as string,
  },
  strict: true,
  verbose: true,
});
