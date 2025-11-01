import * as dotenv from "dotenv";
import { connectToDatabase, collections } from "./database";

dotenv.config();

const { ATLAS_URI } = process.env;

const uri = ATLAS_URI || 'mongodb://localhost:27017';

const departments = [
  { name: "frontend" },
  { name: "backend" },
  { name: "database" },
  { name: "deployment" },
  { name: "consultants" }
];

async function seed() {
  await connectToDatabase(uri);

  for (const dep of departments) {
    const existing = await collections.department?.findOne({ name: dep.name });
    if (!existing) {
      await collections.department?.insertOne(dep);
      console.log(`Inserted department: ${dep.name}`);
    } else {
      console.log(`Department ${dep.name} already exists`);
    }
  }

  console.log("Seeding completed.");
  process.exit(0);
}

seed().catch(console.error);
