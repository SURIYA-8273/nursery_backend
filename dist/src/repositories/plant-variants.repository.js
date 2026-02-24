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
exports.PlantVariantsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../services/prisma.service");
let PlantVariantsRepository = class PlantVariantsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.plantVariant.create({ data });
    }
    async findAll() {
        return this.prisma.plantVariant.findMany({
            include: { plant: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByPlantId(plantId) {
        return this.prisma.plantVariant.findMany({
            where: { plantId },
            orderBy: { price: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.plantVariant.findUnique({
            where: { id },
            include: { plant: true },
        });
    }
    async update(id, data) {
        return this.prisma.plantVariant.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.plantVariant.delete({ where: { id } });
    }
};
exports.PlantVariantsRepository = PlantVariantsRepository;
exports.PlantVariantsRepository = PlantVariantsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlantVariantsRepository);
//# sourceMappingURL=plant-variants.repository.js.map