"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const plantsToCheck = ['Jackfruit', 'Semmaram', 'Vengai Tree', 'Wild Fig Tree'];
    const variants = await prisma.plantVariant.findMany({
        where: { plant: { name: { in: plantsToCheck } } },
        include: { plant: true }
    });
    console.log(JSON.stringify(variants.map(v => ({
        plant: v.plant.name,
        size: v.size,
        coverImages: v.coverImages
    })), null, 2));
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=verify-variants-refined.js.map