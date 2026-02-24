import { UsersService } from './users.service';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
