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
exports.PlantsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../services/prisma.service");
let PlantsRepository = class PlantsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.plant.create({ data });
    }
    async findAllCategories() {
        return this.prisma.category.findMany();
    }
    async findAll(params) {
        return this.prisma.plant.findMany({
            where: params.where,
            skip: params.skip,
            take: params.take,
            include: { category: true, variants: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async countAll(where) {
        return this.prisma.plant.count({ where });
    }
    async findFeatured() {
        return this.prisma.plant.findMany({
            where: { isFeatured: true },
            include: { category: true, variants: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.plant.findUnique({
            where: { id },
            include: { category: true, variants: true },
        });
    }
    async update(id, data) {
        return this.prisma.plant.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.plant.delete({ where: { id } });
    }
};
exports.PlantsRepository = PlantsRepository;
exports.PlantsRepository = PlantsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlantsRepository);
//# sourceMappingURL=plants.repository.js.map