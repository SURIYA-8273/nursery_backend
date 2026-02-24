import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private repository: CategoriesRepository) {}

  async create(dto: CreateCategoryDto) {
    return this.repository.create(dto);
  }

  async bulkCreate(names: string[]) {
    const result = await this.repository.createMany(names);
    return { created: result.count, message: `${result.count} categories imported` };
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const category = await this.repository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id); // Ensure exists
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.repository.remove(id);
  }
}
