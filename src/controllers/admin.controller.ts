import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(Role.ADMIN)
  getDashboard() {
    return {
      message: 'Welcome to the Admin Dashboard',
      stats: {
        users: 100,
        orders: 50,
      },
    };
  }
}
