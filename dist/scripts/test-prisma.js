"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
async function testPrisma() {
    console.log('Testing Prisma connection with adapter...');
    console.log('URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    try {
        const start = Date.now();
        await prisma.$connect();
        console.log(`Connected successfully in ${Date.now() - start}ms`);
        const categories = await prisma.category.findMany();
        console.log('Categories found:', categories.length);
        console.log('Sample:', categories[0]?.name);
        await prisma.$disconnect();
        await pool.end();
    }
    catch (err) {
        console.error('Prisma connection failed:', err);
        process.exit(1);
    }
}
testPrisma();
//# sourceMappingURL=test-prisma.js.map