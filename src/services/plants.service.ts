import { Injectable, NotFoundException } from '@nestjs/common';
import { PlantsRepository } from '../repositories/plants.repository';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { UpdatePlantDto } from '../dto/update-plant.dto';
import { SupabaseStorageService } from './supabase-storage.service';

@Injectable()
export class PlantsService {
  constructor(
    private repository: PlantsRepository,
    private storageService: SupabaseStorageService,
  ) {}

  async create(dto: CreatePlantDto) {
    const { categoryId, variants, ...rest } = dto;
    const slug = rest.slug || rest.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return this.repository.create({
      ...rest,
      slug,
      category: { connect: { id: categoryId } },
      ...(variants && variants.length > 0
        ? { variants: { create: variants } }
        : {}),
    } as any);
  }

  async bulkCreate(data: any[]) {
    // 1. Fetch all categories to map name -> id
    const categories = await this.repository.findAllCategories();
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    let createdCount = 0;
    const results: any[] = [];

    for (const item of data) {
      try {
        const { id, category, variants, relatedPlantsIds, baseImageUrl, ...rest } = item;
        const catName = typeof category === 'string' ? category : item.category;
        const catId = categoryMap.get(catName?.toLowerCase());

        if (!catId) {
          console.warn(`Category not found: ${catName} for plant: ${rest.name}`);
          continue;
        }

        const slug = rest.name.toLowerCase().trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const cleanedVariants = (variants || []).map((variant: any) => {
          const { id: vId, ...vRest } = variant;
          return vRest;
        });

        const plant = await this.repository.create({
          ...rest,
          slug,
          category: { connect: { id: catId } },
          variants: {
            create: cleanedVariants
          }
        } as any);

        results.push(plant);
        createdCount++;
      } catch (err) {
        console.error(`Failed to import plant "${item.name}":`, err);
      }
    }

    return { created: createdCount, message: `${createdCount} plants imported successfully.` };
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, category, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && category !== 'All') {
      where.category = { name: { equals: category, mode: 'insensitive' } };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subName: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.repository.findAll({ skip, take: limit, where }),
      this.repository.countAll(where),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFeatured() {
    return this.repository.findFeatured();
  }

  async findOne(id: string) {
    const plant = await this.repository.findOne(id);
    if (!plant) {
      throw new NotFoundException(`Plant with ID "${id}" not found`);
    }
    return plant;
  }

  async update(id: string, dto: UpdatePlantDto) {
    const oldPlant = await this.findOne(id);
    const { categoryId, variants, ...rest } = dto as any;
    const data: any = { ...rest };

    // Cleanup plant thumbnail if changed
    if (rest.baseImageUrl && oldPlant.baseImageUrl && rest.baseImageUrl !== oldPlant.baseImageUrl) {
      await this.storageService.deleteFile(oldPlant.baseImageUrl);
    }

    if (categoryId) {
      data.category = { connect: { id: categoryId } };
    }

    if (variants && Array.isArray(variants)) {
      // Collect all images present in the NEW variants data
      const newImages = new Set<string>();
      variants.forEach((v: any) => {
        if (v.coverImages && Array.isArray(v.coverImages)) {
          v.coverImages.forEach((url: string) => newImages.add(url));
        }
      });

      // Cleanup only images that are NOT in the new list
      if (oldPlant.variants && oldPlant.variants.length > 0) {
        for (const variant of oldPlant.variants) {
          if (variant.coverImages && Array.isArray(variant.coverImages)) {
            for (const imgUrl of variant.coverImages) {
              if (!newImages.has(imgUrl)) {
                await this.storageService.deleteFile(imgUrl);
              }
            }
          }
        }
      }

      // Delete existing variants and create new ones
      data.variants = {
        deleteMany: {},
        create: variants,
      };
    }
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    const plant = await this.findOne(id);

    // Delete plant thumbnail
    if (plant.baseImageUrl) {
      await this.storageService.deleteFile(plant.baseImageUrl);
    }

    // Delete all variant images
    if (plant.variants && plant.variants.length > 0) {
      for (const variant of plant.variants) {
        if (variant.coverImages && Array.isArray(variant.coverImages)) {
          for (const imgUrl of variant.coverImages) {
            await this.storageService.deleteFile(imgUrl);
          }
        }
      }
    }

    return this.repository.remove(id);
  }
}
