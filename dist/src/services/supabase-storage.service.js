"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const uuid_1 = require("uuid");
let SupabaseStorageService = class SupabaseStorageService {
    supabase;
    bucketName = 'plant-images';
    ensuredBuckets = new Set();
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
        if (!supabaseUrl || !supabaseKey) {
            console.warn('⚠️  SUPABASE_URL and SUPABASE_SERVICE_KEY not set — image upload will be disabled.');
            return;
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async ensureBucketExists(bucketName) {
        if (this.ensuredBuckets.has(bucketName) || !this.supabase)
            return;
        try {
            const { data: buckets } = await this.supabase.storage.listBuckets();
            const exists = buckets?.some((b) => b.id === bucketName);
            if (!exists) {
                console.log(`Creating bucket: ${bucketName}`);
                const { error } = await this.supabase.storage.createBucket(bucketName, {
                    public: true,
                    fileSizeLimit: 52428800,
                });
                if (error)
                    throw error;
            }
            else {
                await this.supabase.storage.updateBucket(bucketName, {
                    public: true,
                    fileSizeLimit: 52428800,
                });
            }
            this.ensuredBuckets.add(bucketName);
        }
        catch (err) {
            console.error(`Failed to ensure bucket "${bucketName}" exists:`, err);
        }
    }
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/(\d+)\s*x\s*(\d+)/g, '$1x$2')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    }
    async getNextAvailableFileName(folder, baseName, ext, bucket) {
        const { data: files, error } = await this.supabase.storage
            .from(bucket)
            .list(folder, {
            search: baseName,
        });
        if (error) {
            console.warn(`Error listing files for sequencing: ${error.message}`);
            return folder ? `${folder}/${baseName}-1.${ext}` : `${baseName}-1.${ext}`;
        }
        let maxNum = 0;
        const regex = new RegExp(`^${baseName}-(\\d+)\\.${ext}$`);
        files?.forEach((file) => {
            const match = file.name.match(regex);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum)
                    maxNum = num;
            }
        });
        const newFileName = `${baseName}-${maxNum + 1}.${ext}`;
        return folder ? `${folder}/${newFileName}` : newFileName;
    }
    async uploadFile(file, folder = '', bucket, customName) {
        if (!this.supabase) {
            throw new common_1.BadRequestException('Image upload is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
        }
        const targetBucket = bucket || this.bucketName;
        await this.ensureBucketExists(targetBucket);
        const ext = file.originalname.split('.').pop() || 'jpg';
        let fileName;
        if (customName) {
            const baseName = this.slugify(customName);
            fileName = await this.getNextAvailableFileName(folder, baseName, ext, targetBucket);
        }
        else {
            const uuid = (0, uuid_1.v4)();
            fileName = folder ? `${folder}/${uuid}.${ext}` : `${uuid}.${ext}`;
        }
        const { data, error } = await this.supabase.storage
            .from(targetBucket)
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error) {
            console.error(`Upload failed for bucket "${targetBucket}", path "${fileName}":`, error);
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
        const { data: urlData } = this.supabase.storage
            .from(targetBucket)
            .getPublicUrl(data.path);
        return urlData.publicUrl;
    }
    async uploadMultipleFiles(files, folder = '', bucket, customName) {
        const urls = [];
        for (const file of files) {
            const url = await this.uploadFile(file, folder, bucket, customName);
            urls.push(url);
        }
        return urls;
    }
    async deleteFile(filePath, bucket) {
        if (!filePath || !this.supabase)
            return;
        let targetBucket = bucket;
        let path = filePath;
        if (filePath.includes('/storage/v1/object/public/')) {
            const parts = filePath.split('/storage/v1/object/public/');
            const bucketAndPath = parts[1];
            const firstSlashIdx = bucketAndPath.indexOf('/');
            if (firstSlashIdx !== -1) {
                targetBucket = bucketAndPath.substring(0, firstSlashIdx);
                path = bucketAndPath.substring(firstSlashIdx + 1);
            }
        }
        else {
            targetBucket = bucket || this.bucketName;
            path = filePath.split(`${targetBucket}/`).pop() || filePath;
        }
        if (!targetBucket) {
            console.warn(`Could not determine bucket for deletion: ${filePath}`);
            return;
        }
        const { error } = await this.supabase.storage
            .from(targetBucket)
            .remove([path]);
        if (error) {
            console.error(`Delete failed for bucket "${targetBucket}", path "${path}":`, error);
        }
    }
};
exports.SupabaseStorageService = SupabaseStorageService;
exports.SupabaseStorageService = SupabaseStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseStorageService);
//# sourceMappingURL=supabase-storage.service.js.map