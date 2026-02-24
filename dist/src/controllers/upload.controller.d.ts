import { SupabaseStorageService } from '../services/supabase-storage.service';
export declare class UploadController {
    private readonly storageService;
    constructor(storageService: SupabaseStorageService);
    uploadSingle(file: Express.Multer.File, bucket?: string, name?: string): Promise<{
        url: string;
    }>;
    uploadMultiple(files: Express.Multer.File[], bucket?: string, name?: string): Promise<{
        urls: string[];
    }>;
}
