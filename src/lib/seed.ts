import "dotenv/config";
// import { industries } from "../models/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { industries } from "../models/schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL ?? "", { max: 1 });
  const db = drizzle(client);

  console.log("Seeding industries table initiated.");

  const industriesArr = [
    "Marketing and Communications",
    "Banking and Finance",
    "Healthcare and Life Sciences",
    "Education and Research",
    "Entertainment and Media",
    "Environment and Sustainability",
    "Government and Non-Profit",
    "Professional Services",
  ];

  console.log("Seeding the industries table.");
  await db.transaction(async (tx) => {
    for (const industry of industriesArr) {
      const [{ id, name }] = await tx
        .insert(industries)
        .values({ name: industry })
        .returning();
      console.log(`added: ${id} - ${name}`);
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
