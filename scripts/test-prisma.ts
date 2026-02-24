import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function testPrisma() {
  console.log('Testing Prisma connection with adapter...');
  console.log('URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const start = Date.now();
    await prisma.$connect();
    console.log(`Connected successfully in ${Date.now() - start}ms`);

    const categories = await prisma.category.findMany();
    console.log('Categories found:', categories.length);
    console.log('Sample:', categories[0]?.name);

    await prisma.$disconnect();
    await pool.end();
  } catch (err) {
    console.error('Prisma connection failed:', err);
    process.exit(1);
  }
}

testPrisma();
