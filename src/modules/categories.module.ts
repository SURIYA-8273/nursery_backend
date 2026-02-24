import { Module } from '@nestjs/common';
import { CategoriesController } from '../controllers/categories.controller';
import { CategoriesService } from '../services/categories.service';
import { CategoriesRepository } from '../repositories/categories.repository';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
