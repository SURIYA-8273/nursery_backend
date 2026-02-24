import { Module } from '@nestjs/common';
import { PlantVariantsController } from '../controllers/plant-variants.controller';
import { PlantVariantsService } from '../services/plant-variants.service';
import { PlantVariantsRepository } from '../repositories/plant-variants.repository';
import { UploadModule } from './upload.module';

@Module({
  imports: [UploadModule],
  controllers: [PlantVariantsController],
  providers: [PlantVariantsService, PlantVariantsRepository],
  exports: [PlantVariantsService],
})
export class PlantVariantsModule {}
