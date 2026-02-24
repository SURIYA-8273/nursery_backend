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
exports.PlantVariantsService = void 0;
const common_1 = require("@nestjs/common");
const plant_variants_repository_1 = require("../repositories/plant-variants.repository");
const supabase_storage_service_1 = require("./supabase-storage.service");
let PlantVariantsService = class PlantVariantsService {
    repository;
    storageService;
    constructor(repository, storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }
    async create(dto) {
        const { plantId, ...rest } = dto;
        return this.repository.create({
            ...rest,
            plant: { connect: { id: plantId } },
        });
    }
    async findAll() {
        return this.repository.findAll();
    }
    async findByPlantId(plantId) {
        return this.repository.findByPlantId(plantId);
    }
    async findOne(id) {
        const variant = await this.repository.findOne(id);
        if (!variant) {
            throw new common_1.NotFoundException(`PlantVariant with ID "${id}" not found`);
        }
        return variant;
    }
    async update(id, dto) {
        const oldVariant = await this.findOne(id);
        const { plantId, ...rest } = dto;
        const data = { ...rest };
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
    async remove(id) {
        const variant = await this.findOne(id);
        if (variant.coverImages && Array.isArray(variant.coverImages)) {
            for (const imgUrl of variant.coverImages) {
                await this.storageService.deleteFile(imgUrl);
            }
        }
        return this.repository.remove(id);
    }
};
exports.PlantVariantsService = PlantVariantsService;
exports.PlantVariantsService = PlantVariantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [plant_variants_repository_1.PlantVariantsRepository,
        supabase_storage_service_1.SupabaseStorageService])
], PlantVariantsService);
//# sourceMappingURL=plant-variants.service.js.map