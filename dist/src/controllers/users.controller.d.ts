import { UsersService } from '../services/users.service';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    findAll(): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    remove(id: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
