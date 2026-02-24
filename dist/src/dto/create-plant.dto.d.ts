export declare class VariantInput {
    size: string;
    price: number;
    discount?: number;
    ratings?: number;
    reviewsCount?: number;
    growthRate?: string;
    height?: string;
    weight?: string;
    quantityInStock?: number;
    isAvailable?: boolean;
    coverImages?: string[];
}
export declare class CreatePlantDto {
    name: string;
    slug: string;
    tamilName?: string;
    subName?: string;
    description?: string;
    baseImageUrl?: string;
    categoryId: string;
    careInfo?: string;
    fertilizingInfo?: string;
    usageInfo?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    tags?: string[];
    relatedPlantsIds?: string[];
    variants?: VariantInput[];
}
