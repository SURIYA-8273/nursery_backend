import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET_NAME = 'plants-thumnail';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Define the plant thumbnails data based on the provided object
const BASE_THUMBNAIL_PATH = '/plants/thumbnail';
const plantThumbnails = {
  semparuthi: `${BASE_THUMBNAIL_PATH}/semparuthi.jpg`,
  ixora_white: `${BASE_THUMBNAIL_PATH}/ixora_white.jpg`,
  yellow_allamanda: `${BASE_THUMBNAIL_PATH}/yellow_allamanda.jpg`,
  guava: `${BASE_THUMBNAIL_PATH}/guava.jpg`,
  golden_shower: `${BASE_THUMBNAIL_PATH}/golden_shower.jpg`,
  wild_fig: `${BASE_THUMBNAIL_PATH}/wild_fig.jpg`,
  aralia_white: `${BASE_THUMBNAIL_PATH}/aralia_white.jpg`,
  hawaiian_ti: `${BASE_THUMBNAIL_PATH}/hawaiian_ti.jpg`,
  ixora_pink: `${BASE_THUMBNAIL_PATH}/ixora_pink.jpg`,
  ixora_red: `${BASE_THUMBNAIL_PATH}/ixora_red.jpg`,
  pannir_rose: `${BASE_THUMBNAIL_PATH}/pannir_rose.jpg`,
  croton_petra: `${BASE_THUMBNAIL_PATH}/croton_petra.jpg`,
  mexican_mint: `${BASE_THUMBNAIL_PATH}/mexican_mint.jpg`,
  duranta: `${BASE_THUMBNAIL_PATH}/duranta.jpg`,
  jackfruit: `${BASE_THUMBNAIL_PATH}/jackfruit.jpg`,
  vengai: `${BASE_THUMBNAIL_PATH}/vengai.jpg`,
  semmaram: `${BASE_THUMBNAIL_PATH}/semmaram.jpg`,
};

// Map file extensions to content types
const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

async function ensureBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error.message);
    return;
  }

  const exists = buckets.some((b) => b.id === BUCKET_NAME);
  if (!exists) {
    console.log(`Creating bucket: ${BUCKET_NAME}`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    if (createError) {
      console.error('Error creating bucket:', createError.message);
    }
  } else {
    console.log(`Bucket ${BUCKET_NAME} already exists.`);
  }
}

async function uploadThumbnails() {
  await ensureBucketExists();

  const publicDir = path.join(__dirname, '../../nursery/public');
  
  console.log('Starting upload of thumbnails...');

  for (const [key, relativePath] of Object.entries(plantThumbnails)) {
    const filePath = path.join(publicDir, relativePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found at ${filePath}. Skipping ${key}.`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    const fileName = path.basename(filePath);

    console.log(`Uploading ${key} (${fileName})...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error(`Error uploading ${key}:`, error.message);
    } else {
      console.log(`Successfully uploaded ${key}. Path: ${data.path}`);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);
      
      console.log(`Public URL: ${urlData.publicUrl}`);
    }
  }

  console.log('Upload process completed.');
}

uploadThumbnails().catch((err) => {
  console.error('Fatal error in upload script:', err);
  process.exit(1);
});
