import { Module } from '@nestjs/common';
import { PlantVariantsController } from './plant-variants.controller';
import { PlantVariantsService } from './plant-variants.service';
import { PlantVariantsRepository } from './plant-variants.repository';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [PlantVariantsController],
  providers: [PlantVariantsService, PlantVariantsRepository],
  exports: [PlantVariantsService],
})
export class PlantVariantsModule {}
