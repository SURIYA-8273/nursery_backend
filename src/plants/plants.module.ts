import { Module } from '@nestjs/common';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { PlantsRepository } from './plants.repository';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [PlantsController],
  providers: [PlantsService, PlantsRepository],
  exports: [PlantsService],
})
export class PlantsModule {}
