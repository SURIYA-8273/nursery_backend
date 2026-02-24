import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Plant } from '@prisma/client';

@Injectable()
export class PlantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PlantCreateInput): Promise<Plant> {
    return this.prisma.plant.create({ data });
  }

  async findAllCategories() {
    return this.prisma.category.findMany();
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PlantWhereInput;
  }): Promise<Plant[]> {
    return this.prisma.plant.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countAll(where?: Prisma.PlantWhereInput): Promise<number> {
    return this.prisma.plant.count({ where });
  }

  async findFeatured(): Promise<Plant[]> {
    return this.prisma.plant.findMany({
      where: { isFeatured: true },
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.plant.findUnique({
      where: { id },
      include: { category: true, variants: true },
    });
  }

  async update(id: string, data: Prisma.PlantUpdateInput): Promise<Plant> {
    return this.prisma.plant.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Plant> {
    return this.prisma.plant.delete({ where: { id } });
  }
}
