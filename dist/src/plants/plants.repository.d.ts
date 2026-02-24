import { PrismaService } from '../database/prisma.service';
import { Prisma, Plant } from '@prisma/client';
export declare class PlantsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PlantCreateInput): Promise<Plant>;
    findAllCategories(): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.PlantWhereInput;
    }): Promise<Plant[]>;
    countAll(where?: Prisma.PlantWhereInput): Promise<number>;
    findFeatured(): Promise<Plant[]>;
    findOne(id: string): Promise<({
        category: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isAvailable: boolean;
            size: string;
            price: number;
            discount: number;
            ratings: number;
            reviewsCount: number;
            growthRate: string | null;
            height: string | null;
            weight: string | null;
            quantityInStock: number;
            coverImages: string[];
            plantId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        tamilName: string | null;
        subName: string | null;
        description: string | null;
        baseImageUrl: string | null;
        careInfo: string | null;
        fertilizingInfo: string | null;
        usageInfo: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        tags: string[];
        relatedPlantsIds: string[];
        categoryId: string;
    }) | null>;
    update(id: string, data: Prisma.PlantUpdateInput): Promise<Plant>;
    remove(id: string): Promise<Plant>;
}
