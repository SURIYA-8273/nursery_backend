import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(params: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(params);
  }

  async create(params: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(params);
  }

  async findMany(): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
