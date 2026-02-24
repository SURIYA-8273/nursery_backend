import { Injectable, NotFoundException } from '@nestjs/common';
import { PlantVariantsRepository } from '../repositories/plant-variants.repository';
import { CreatePlantVariantDto } from '../dto/create-plant-variant.dto';
import { UpdatePlantVariantDto } from '../dto/update-plant-variant.dto';
import { SupabaseStorageService } from './supabase-storage.service';

@Injectable()
export class PlantVariantsService {
  constructor(
    private repository: PlantVariantsRepository,
    private storageService: SupabaseStorageService,
  ) {}

  async create(dto: CreatePlantVariantDto) {
    const { plantId, ...rest } = dto;
    return this.repository.create({
      ...rest,
      plant: { connect: { id: plantId } },
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByPlantId(plantId: string) {
    return this.repository.findByPlantId(plantId);
  }

  async findOne(id: string) {
    const variant = await this.repository.findOne(id);
    if (!variant) {
      throw new NotFoundException(`PlantVariant with ID "${id}" not found`);
    }
    return variant;
  }

  async update(id: string, dto: UpdatePlantVariantDto) {
    const oldVariant = await this.findOne(id);
    const { plantId, ...rest } = dto;
    const data: any = { ...rest };

    // Cleanup images if they were removed/replaced
    if (rest.coverImages && Array.isArray(rest.coverImages)) {
      const oldImages = oldVariant.coverImages || [];
      const newImages = rest.coverImages;
      const toDelete = oldImages.filter((img) => !newImages.includes(img));

      for (const imgUrl of toDelete) {
        await this.storageService.deleteFile(imgUrl);
      }
    }

    if (plantId) {
      data.plant = { connect: { id: plantId } };
    }
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    const variant = await this.findOne(id);

    // Delete all cover images
    if (variant.coverImages && Array.isArray(variant.coverImages)) {
      for (const imgUrl of variant.coverImages) {
        await this.storageService.deleteFile(imgUrl);
      }
    }

    return this.repository.remove(id);
  }
}
