import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma, PlantVariant } from '@prisma/client';

@Injectable()
export class PlantVariantsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PlantVariantCreateInput): Promise<PlantVariant> {
    return this.prisma.plantVariant.create({ data });
  }

  async findAll(): Promise<PlantVariant[]> {
    return this.prisma.plantVariant.findMany({
      include: { plant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPlantId(plantId: string): Promise<PlantVariant[]> {
    return this.prisma.plantVariant.findMany({
      where: { plantId },
      orderBy: { price: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.plantVariant.findUnique({
      where: { id },
      include: { plant: true },
    });
  }

  async update(id: string, data: Prisma.PlantVariantUpdateInput): Promise<PlantVariant> {
    return this.prisma.plantVariant.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PlantVariant> {
    return this.prisma.plantVariant.delete({ where: { id } });
  }
}
