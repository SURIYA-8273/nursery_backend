import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseStorageService } from '../services/supabase-storage.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UploadController {
  constructor(private readonly storageService: SupabaseStorageService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Query('bucket') bucket?: string,
    @Query('name') name?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const url = await this.storageService.uploadFile(
      file,
      '',
      bucket,
      name,
    );
    return { url };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('bucket') bucket?: string,
    @Query('name') name?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    const urls = await this.storageService.uploadMultipleFiles(
      files,
      '',
      bucket,
      name,
    );
    return { urls };
  }
}
