import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const variants = await prisma.plantVariant.findMany({
    include: { plant: true },
    take: 10
  });
  console.log(JSON.stringify(variants.map(v => ({
    plant: v.plant.name,
    size: v.size,
    coverImages: v.coverImages
  })), null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
