const pg = require('pg');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    console.log("Removing old migration record using pg directly...");
    await pool.query('DELETE FROM "_prisma_migrations" WHERE migration_name = $1', ['20260512193700_status_update']);
    console.log("Done.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
