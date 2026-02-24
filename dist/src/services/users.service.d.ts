import { UsersRepository } from '../repositories/users.repository';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private repository;
    constructor(repository: UsersRepository);
    findOneByEmail(email: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    findAll(): Promise<User[]>;
    remove(id: string): Promise<User>;
}
