import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private repository;
    constructor(repository: CategoriesRepository);
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    bulkCreate(names: string[]): Promise<{
        created: number;
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }>;
}
