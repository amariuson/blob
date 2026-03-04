import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

// Use max 1 connection for migrations
const client = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(client);

async function main() {
	console.log('Running migrations...');
	const start = Date.now();

	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		const duration = Date.now() - start;
		console.log(`Migrations complete in ${duration}ms`);
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	} finally {
		await client.end();
	}
}

main();
