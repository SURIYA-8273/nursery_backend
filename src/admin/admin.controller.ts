import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
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
