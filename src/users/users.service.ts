import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.repository.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.repository.findMany();
  }

  async remove(id: string): Promise<User> {
    return this.repository.delete(id);
  }
}
