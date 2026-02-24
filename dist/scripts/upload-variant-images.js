"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const supabase_js_1 = require("@supabase/supabase-js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET_NAME = 'variants';
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const plantImageMapping = {
    'Hybiscus Red': 'semparuthi',
    'Ixora White': 'ixora_white',
    'Ixora Pink': 'ixora_pink',
    'Aralia White': 'aralia_white',
    'Hawaiian Ti Plant': 'hawaiian_ti',
    'Pannir Rose Plant': 'pannir_rose',
    'Ixora Red Plant': 'ixora_red',
    'Yellow Allamanda Plant': 'yellow_allamanda',
    'Guava Plant': 'guava',
    'Golden Shower Tree': 'golden_shower',
    'Wild Fig Tree': 'wild_fig',
    'Croton Petra': 'croton_petra',
    'Mexican Mint': 'mexican_mint',
    'Duranta | sky flowe': 'duranta',
    'Jackfruit': 'jackfruit',
    'Vengai Tree': 'vengai',
    'Semmaram': 'semmaram',
};
function slugifySize(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/(\d+)\s*x\s*(\d+)/g, '$1x$2')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}
async function ensureBucketExists() {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error)
        throw error;
    if (!buckets?.some(b => b.id === BUCKET_NAME)) {
        console.log(`Creating bucket: ${BUCKET_NAME}`);
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
        });
        if (createError)
            throw createError;
    }
}
async function main() {
    await ensureBucketExists();
    console.log('Fetching plants from database...');
    const plants = await prisma.plant.findMany({
        include: { variants: { orderBy: { createdAt: 'asc' } } }
    });
    const localImagesDir = path.join(__dirname, '../../nursery/public/plants/cover_images');
    for (const plant of plants) {
        const slug = plantImageMapping[plant.name];
        if (!slug) {
            console.warn(`No mapping for plant: ${plant.name}`);
            continue;
        }
        if (plant.variants.length === 0) {
            console.warn(`No variants found for plant: ${plant.name}`);
            continue;
        }
        const firstVariant = plant.variants[0];
        const rawSize = firstVariant.size;
        const formattedSize = slugifySize(rawSize);
        const uploadedUrls = [];
        for (const suffix of ['1', '2']) {
            const localFilename = `${slug}-${suffix}.jpg`;
            const localPath = path.join(localImagesDir, localFilename);
            if (!fs.existsSync(localPath)) {
                console.warn(`File not found: ${localPath}`);
                continue;
            }
            const remoteFilename = `${slug}-${formattedSize}-${suffix}.jpg`;
            console.log(`Uploading ${localFilename} as ${remoteFilename}...`);
            const fileBuffer = fs.readFileSync(localPath);
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(remoteFilename, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });
            if (error) {
                console.error(`Upload error for ${remoteFilename}:`, error.message);
                continue;
            }
            const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
            uploadedUrls.push(urlData.publicUrl);
        }
        if (uploadedUrls.length > 0) {
            console.log(`Updating first variant for ${plant.name} with ${uploadedUrls.length} images...`);
            await prisma.plantVariant.update({
                where: { id: firstVariant.id },
                data: { coverImages: uploadedUrls }
            });
            const otherVariantIds = plant.variants.slice(1).map(v => v.id);
            if (otherVariantIds.length > 0) {
                console.log(`Clearing coverImages for ${otherVariantIds.length} other variants of ${plant.name}...`);
                await prisma.plantVariant.updateMany({
                    where: { id: { in: otherVariantIds } },
                    data: { coverImages: [] }
                });
            }
        }
    }
    console.log('Completed cover image upload and database update.');
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=upload-variant-images.js.map