import "dotenv/config";
// import { industries } from "../models/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { industries } from "../models/schema";
import { industriesArr } from "./constants";

async function seed() {
  const client = postgres(process.env.DATABASE_URL ?? "", { max: 1 });
  const db = drizzle(client);

  console.log("Seeding industries table initiated.");


  console.log("Seeding the industries table.");
  await db.transaction(async (tx) => {
    for (const industry of industriesArr) {
      const [{ id, industry_name }] = await tx
        .insert(industries)
        .values({ industry_name: industry })
        .returning();
      console.log(`added: ${id} - ${industry_name}`);
    }
  });
  console.log("Seeding of the industries table is complete.");

  await client.end();
}

seed()
  .then(() => console.log("Database seeding completed successfully."))
  .catch((err) => {
    console.log("Database seeding failed.");
    console.error(err);
  });
