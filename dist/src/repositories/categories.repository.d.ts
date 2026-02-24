import { PrismaService } from '../services/prisma.service';
import { Prisma, Category } from '@prisma/client';
export declare class CategoriesRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    createMany(names: string[]): Promise<{
        count: number;
    }>;
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category | null>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    remove(id: string): Promise<Category>;
}
