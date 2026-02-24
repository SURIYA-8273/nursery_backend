"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_KEY);
async function listFiles(bucket) {
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
            console.log(`[DIR]  ${file.name}`);
        }
        else {
            console.log(`[FILE] ${file.name} (${file.metadata.size} bytes)`);
        }
    });
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
//# sourceMappingURL=list-storage.js.map