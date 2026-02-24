import { Module } from '@nestjs/common';
import { PlantsController } from '../controllers/plants.controller';
import { PlantsService } from '../services/plants.service';
import { PlantsRepository } from '../repositories/plants.repository';
import { UploadModule } from './upload.module';

@Module({
  imports: [UploadModule],
  controllers: [PlantsController],
  providers: [PlantsService, PlantsRepository],
  exports: [PlantsService],
})
export class PlantsModule {}
