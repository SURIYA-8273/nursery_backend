"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv/config");
async function testConnection() {
    const url = process.env.DATABASE_URL?.replace(':5432', ':6543');
    console.log('Testing database connection with port 6543...');
    console.log('URL:', url?.replace(/:[^:@]+@/, ':****@'));
    const pool = new pg_1.Pool({
        connectionString: url,
        connectionTimeoutMillis: 10000,
    });
    try {
        const start = Date.now();
        const client = await pool.connect();
        console.log(`Connected successfully in ${Date.now() - start}ms`);
        const res = await client.query('SELECT NOW()');
        console.log('Query successful:', res.rows[0]);
        client.release();
        await pool.end();
        console.log('Connection closed.');
    }
    catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}
testConnection();
//# sourceMappingURL=test-db-6543.js.map