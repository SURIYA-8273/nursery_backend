import { PrismaService } from '../database/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findUnique(params: Prisma.UserFindUniqueArgs): Promise<User | null>;
    create(params: Prisma.UserCreateArgs): Promise<User>;
    findMany(): Promise<User[]>;
    delete(id: string): Promise<User>;
}
