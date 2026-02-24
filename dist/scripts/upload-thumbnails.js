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
const supabase_js_1 = require("@supabase/supabase-js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET_NAME = 'plants-thumnail';
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env');
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_KEY);
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
const getContentType = (filename) => {
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
            fileSizeLimit: 52428800,
        });
        if (createError) {
            console.error('Error creating bucket:', createError.message);
        }
    }
    else {
        console.log(`Bucket ${BUCKET_NAME} already exists.`);
    }
}
async function uploadThumbnails() {
    await ensureBucketExists();
    const publicDir = path.join(__dirname, '../../nursery/public');
    console.log('Starting upload of thumbnails...');
    for (const [key, relativePath] of Object.entries(plantThumbnails)) {
        const filePath = path.join(publicDir, relativePath);
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
            upsert: true,
        });
        if (error) {
            console.error(`Error uploading ${key}:`, error.message);
        }
        else {
            console.log(`Successfully uploaded ${key}. Path: ${data.path}`);
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
//# sourceMappingURL=upload-thumbnails.js.map