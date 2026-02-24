import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const STORAGE_URL = 'https://xvnkhlhjupsuigwikdmh.supabase.co/storage/v1/object/public/plants-thumnail';

// Mapping of plant names (from DB) to image filenames
const plantImageMapping: Record<string, string> = {
  'Hybiscus Red': 'semparuthi.jpg',
  'Ixora White': 'ixora_white.jpg',
  'Ixora Pink': 'ixora_pink.jpg',
  'Aralia White': 'aralia_white.jpg',
  'Hawaiian Ti Plant': 'hawaiian_ti.jpg',
  'Pannir Rose Plant': 'pannir_rose.jpg',
  'Ixora Red Plant': 'ixora_red.jpg',
  'Yellow Allamanda Plant': 'yellow_allamanda.jpg',
  'Guava Plant': 'guava.jpg',
  'Golden Shower Tree': 'golden_shower.jpg',
  'Wild Fig Tree': 'wild_fig.jpg',
  'Croton Petra': 'croton_petra.jpg',
  'Mexican Mint': 'mexican_mint.jpg',
  'Duranta | sky flowe': 'duranta.jpg',
  'Jackfruit': 'jackfruit.jpg',
  'Vengai Tree': 'vengai.jpg',
  'Semmaram': 'semmaram.jpg',
};

async function main() {
  console.log('Starting database update for plant thumbnail URLs...');

  const plants = await prisma.plant.findMany();

  for (const plant of plants) {
    const filename = plantImageMapping[plant.name];

    if (filename) {
      const publicUrl = `${STORAGE_URL}/${filename}`;
      console.log(`Updating ${plant.name}: ${publicUrl}`);

      await prisma.plant.update({
        where: { id: plant.id },
        data: { baseImageUrl: publicUrl },
      });
    } else {
      console.warn(`No image mapping found for plant: ${plant.name}`);
    }
  }

  console.log('Database update completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error updating database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
