import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function listFiles(bucket: string) {
  console.log(`\n--- Files in bucket: ${bucket} ---`);
  const { data, error } = await supabase.storage.from(bucket).list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(`Error listing files in ${bucket}:`, error.message);
    return;
  }

  data?.forEach(file => {
    if (file.id === undefined) {
      // It's a folder (Supabase returns metadata but id is null/undefined for folders in some versions/responses)
      // Actually .list('') should show files and folders at root.
      console.log(`[DIR]  ${file.name}`);
    } else {
      console.log(`[FILE] ${file.name} (${file.metadata.size} bytes)`);
    }
  });

  // Check for thumbnails/ folder if it exists
  const { data: thumbData } = await supabase.storage.from(bucket).list('thumbnails');
  if (thumbData && thumbData.length > 0) {
     console.log(`\n[DIR] thumbnails/ contains ${thumbData.length} files.`);
  }
}

async function main() {
  await listFiles('plants-thumnail');
  await listFiles('variants');
}

main().catch(console.error);
