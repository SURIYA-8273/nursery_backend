import { Module } from '@nestjs/common';
import { UploadController } from '../controllers/upload.controller';
import { SupabaseStorageService } from '../services/supabase-storage.service';

@Module({
  controllers: [UploadController],
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class UploadModule {}
