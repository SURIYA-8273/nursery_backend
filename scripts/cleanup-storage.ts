import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function cleanupBucket(bucketName: string, referencedUrls: Set<string>) {
  console.log(`\n--- Cleaning up bucket: ${bucketName} ---`);
  
  const { data: files, error } = await supabase.storage.from(bucketName).list('', {
    limit: 1000,
  });

  if (error) {
    console.error(`Error listing files: ${error.message}`);
    return;
  }

  const filesToDelete: string[] = [];

  for (const file of files) {
    // metadata.id is null for folders? 
    // In this bucket, they should all be files at the root.
    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
    
    if (!referencedUrls.has(publicUrl)) {
      console.log(`Marking for deletion: ${file.name} (Not referenced)`);
      filesToDelete.push(file.name);
    }
  }

  if (filesToDelete.length > 0) {
    console.log(`Deleting ${filesToDelete.length} files...`);
    const { error: deleteError } = await supabase.storage.from(bucketName).remove(filesToDelete);
    if (deleteError) {
      console.error(`Delete error: ${deleteError.message}`);
    } else {
      console.log('Successfully deleted orphaned files.');
    }
  } else {
    console.log('No orphaned files found.');
  }
}

async function main() {
  const plants = await prisma.plant.findMany({
    select: { baseImageUrl: true }
  });
  const variants = await prisma.plantVariant.findMany({
    select: { coverImages: true }
  });

  const allReferencedUrls = new Set<string>();
  
  plants.forEach(p => {
    if (p.baseImageUrl) allReferencedUrls.add(p.baseImageUrl);
  });
  
  variants.forEach(v => {
    v.coverImages.forEach(url => allReferencedUrls.add(url));
  });

  console.log(`Total referenced URLs in DB: ${allReferencedUrls.size}`);

  await cleanupBucket('plants-thumnail', allReferencedUrls);
  await cleanupBucket('variants', allReferencedUrls);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
