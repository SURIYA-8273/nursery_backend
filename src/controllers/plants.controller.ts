import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query,
} from '@nestjs/common';
import { PlantsService } from '../services/plants.service';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { UpdatePlantDto } from '../dto/update-plant.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreatePlantDto) {
    return this.plantsService.create(dto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  bulk(@Body('plants') data: any[]) {
    return this.plantsService.bulkCreate(data);
  }

  @Get('featured')
  findFeatured() {
    return this.plantsService.findFeatured();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.plantsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      category,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePlantDto) {
    return this.plantsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.plantsService.remove(id);
  }
}
