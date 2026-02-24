import { PrismaService } from '../services/prisma.service';
import { Prisma, PlantVariant } from '@prisma/client';
export declare class PlantVariantsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PlantVariantCreateInput): Promise<PlantVariant>;
    findAll(): Promise<PlantVariant[]>;
    findByPlantId(plantId: string): Promise<PlantVariant[]>;
    findOne(id: string): Promise<({
        plant: {
            name: string;
            id: string;
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
        };
    } & {
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
    }) | null>;
    update(id: string, data: Prisma.PlantVariantUpdateInput): Promise<PlantVariant>;
    remove(id: string): Promise<PlantVariant>;
}
