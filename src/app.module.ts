import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { DatabaseModule } from './modules/database.module';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { AdminModule } from './modules/admin.module';
import { CategoriesModule } from './modules/categories.module';
import { PlantsModule } from './modules/plants.module';
import { PlantVariantsModule } from './modules/plant-variants.module';
import { UploadModule } from './modules/upload.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, AdminModule, CategoriesModule, PlantsModule, PlantVariantsModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
