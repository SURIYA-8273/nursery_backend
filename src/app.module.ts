import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { PlantsModule } from './plants/plants.module';
import { PlantVariantsModule } from './plant-variants/plant-variants.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, AdminModule, CategoriesModule, PlantsModule, PlantVariantsModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
