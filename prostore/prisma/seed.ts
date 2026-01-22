import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import sampleData from "../db/sample-data";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Starting database seed...");

    await prisma.product.deleteMany({});
    console.log("Cleared existing products");

    await prisma.product.createMany({
      data: sampleData.products,
    });

    console.log(
      `Database has been seeded with ${sampleData.products.length} products successfully.`,
    );
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Seed script failed:", e);
  process.exit(1);
});
