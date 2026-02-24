"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantsService = void 0;
const common_1 = require("@nestjs/common");
const plants_repository_1 = require("./plants.repository");
const supabase_storage_service_1 = require("../upload/supabase-storage.service");
let PlantsService = class PlantsService {
    repository;
    storageService;
    constructor(repository, storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }
    async create(dto) {
        const { categoryId, variants, ...rest } = dto;
        const slug = rest.slug || rest.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        return this.repository.create({
            ...rest,
            slug,
            category: { connect: { id: categoryId } },
            ...(variants && variants.length > 0
                ? { variants: { create: variants } }
                : {}),
        });
    }
    async bulkCreate(data) {
        const categories = await this.repository.findAllCategories();
        const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
        let createdCount = 0;
        const results = [];
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
                const cleanedVariants = (variants || []).map((variant) => {
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
                });
                results.push(plant);
                createdCount++;
            }
            catch (err) {
                console.error(`Failed to import plant "${item.name}":`, err);
            }
        }
        return { created: createdCount, message: `${createdCount} plants imported successfully.` };
    }
    async findAll(params) {
        const { page = 1, limit = 10, category, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id) {
        const plant = await this.repository.findOne(id);
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with ID "${id}" not found`);
        }
        return plant;
    }
    async update(id, dto) {
        const oldPlant = await this.findOne(id);
        const { categoryId, variants, ...rest } = dto;
        const data = { ...rest };
        if (rest.baseImageUrl && oldPlant.baseImageUrl && rest.baseImageUrl !== oldPlant.baseImageUrl) {
            await this.storageService.deleteFile(oldPlant.baseImageUrl);
        }
        if (categoryId) {
            data.category = { connect: { id: categoryId } };
        }
        if (variants && Array.isArray(variants)) {
            const newImages = new Set();
            variants.forEach((v) => {
                if (v.coverImages && Array.isArray(v.coverImages)) {
                    v.coverImages.forEach((url) => newImages.add(url));
                }
            });
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
            data.variants = {
                deleteMany: {},
                create: variants,
            };
        }
        return this.repository.update(id, data);
    }
    async remove(id) {
        const plant = await this.findOne(id);
        if (plant.baseImageUrl) {
            await this.storageService.deleteFile(plant.baseImageUrl);
        }
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
};
exports.PlantsService = PlantsService;
exports.PlantsService = PlantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [plants_repository_1.PlantsRepository,
        supabase_storage_service_1.SupabaseStorageService])
], PlantsService);
//# sourceMappingURL=plants.service.js.map