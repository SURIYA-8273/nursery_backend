import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseStorageService {
  private supabase: SupabaseClient;
  private bucketName = 'plant-images';
  private ensuredBuckets = new Set<string>();

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  SUPABASE_URL and SUPABASE_SERVICE_KEY not set — image upload will be disabled.');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  private async ensureBucketExists(bucketName: string) {
    if (this.ensuredBuckets.has(bucketName) || !this.supabase) return;

    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.id === bucketName);

      if (!exists) {
        console.log(`Creating bucket: ${bucketName}`);
        const { error } = await this.supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB limit
        });
        if (error) throw error;
      } else {
        // Ensure existing buckets also have the 50MB limit
        await this.supabase.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB limit
        });
      }
      this.ensuredBuckets.add(bucketName);
    } catch (err) {
      console.error(`Failed to ensure bucket "${bucketName}" exists:`, err);
    }
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/(\d+)\s*x\s*(\d+)/g, '$1x$2') // Handle dimensions like 4 x 6 -> 4x6
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-'); // Replace multiple - with single -
  }

  private async getNextAvailableFileName(
    folder: string,
    baseName: string,
    ext: string,
    bucket: string,
  ): Promise<string> {
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
        if (num > maxNum) maxNum = num;
      }
    });

    const newFileName = `${baseName}-${maxNum + 1}.${ext}`;
    return folder ? `${folder}/${newFileName}` : newFileName;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
    bucket?: string,
    customName?: string,
  ): Promise<string> {
    if (!this.supabase) {
      throw new BadRequestException(
        'Image upload is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env',
      );
    }
    const targetBucket = bucket || this.bucketName;
    await this.ensureBucketExists(targetBucket);

    const ext = file.originalname.split('.').pop() || 'jpg';
    let fileName: string;

    if (customName) {
      const baseName = this.slugify(customName);
      fileName = await this.getNextAvailableFileName(
        folder,
        baseName,
        ext,
        targetBucket,
      );
    } else {
      const uuid = uuidv4();
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
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(targetBucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = '',
    bucket?: string,
    customName?: string,
  ): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const url = await this.uploadFile(file, folder, bucket, customName);
      urls.push(url);
    }
    return urls;
  }

  async deleteFile(filePath: string, bucket?: string): Promise<void> {
    if (!filePath || !this.supabase) return;

    let targetBucket = bucket;
    let path = filePath;

    // If it's a full Supabase URL, extract bucket and path
    // Format: .../storage/v1/object/public/[bucket]/[path]
    if (filePath.includes('/storage/v1/object/public/')) {
      const parts = filePath.split('/storage/v1/object/public/');
      const bucketAndPath = parts[1];
      const firstSlashIdx = bucketAndPath.indexOf('/');
      
      if (firstSlashIdx !== -1) {
        targetBucket = bucketAndPath.substring(0, firstSlashIdx);
        path = bucketAndPath.substring(firstSlashIdx + 1);
      }
    } else {
      // Fallback to provided bucket or default
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
      // We don't always want to throw here during cleanup if the file is already gone
    }
  }
}
