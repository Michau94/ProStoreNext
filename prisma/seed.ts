import { PrismaClient } from "../lib/generated/prisma";

import "dotenv/config";
import sampleData from "../db/sample-data";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Starting database seed...");

    await prisma.product.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.verificationToken.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Cleared existing products");

    await prisma.product.createMany({
      data: sampleData.products,
    });

    await prisma.user.createMany({
      data: sampleData.users,
    });

    console.log(
      `Database has been seeded with ${sampleData.products.length} products successfully.`,
    );

    console.log(
      `Database has been seeded with ${sampleData.users.length} users successfully.`,
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
