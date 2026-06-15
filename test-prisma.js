const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
  } catch (e) {
    console.error('Error connecting:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
