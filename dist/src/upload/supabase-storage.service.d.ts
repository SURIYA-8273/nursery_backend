export declare class SupabaseStorageService {
    private supabase;
    private bucketName;
    private ensuredBuckets;
    constructor();
    private ensureBucketExists;
    private slugify;
    private getNextAvailableFileName;
    uploadFile(file: Express.Multer.File, folder?: string, bucket?: string, customName?: string): Promise<string>;
    uploadMultipleFiles(files: Express.Multer.File[], folder?: string, bucket?: string, customName?: string): Promise<string[]>;
    deleteFile(filePath: string, bucket?: string): Promise<void>;
}
