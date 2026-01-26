import { config } from 'dotenv';
import postgres from 'postgres';
import { Polar } from '@polar-sh/sdk';

// Load .env file
config();

const DATABASE_URL = process.env.DATABASE_URL;
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

if (!DATABASE_URL) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

if (!POLAR_ACCESS_TOKEN) {
	console.error('POLAR_ACCESS_TOKEN is not set');
	process.exit(1);
}

const polarClient = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: 'sandbox'
});

const sql = postgres(DATABASE_URL);

async function deleteAllPolarCustomers() {
	console.log('Deleting all Polar customers...');

	let deleted = 0;
	let page = 1;

	while (true) {
		const customers = await polarClient.customers.list({ page, limit: 100 });

		if (customers.result.items.length === 0) {
			break;
		}

		for (const customer of customers.result.items) {
			try {
				await polarClient.customers.delete({ id: customer.id });
				deleted++;
				console.log(`  Deleted customer: ${customer.email} (${customer.id})`);
			} catch (error) {
				console.warn(`  Failed to delete customer ${customer.id}:`, error);
			}
		}

		page++;
	}

	console.log(`Deleted ${deleted} Polar customers`);
}

async function resetDatabase() {
	console.log('Resetting database...');

	// Drop all tables in reverse order of dependencies
	const tables = [
		'feature_flag_history',
		'feature_flag_grant',
		'feature_flag',
		'audit_log',
		'user_preferences',
		'invitation',
		'member',
		'session',
		'account',
		'verification',
		'organization',
		'user'
	];

	for (const table of tables) {
		try {
			await sql`DROP TABLE IF EXISTS ${sql(table)} CASCADE`;
			console.log(`  Dropped table: ${table}`);
		} catch (error) {
			console.warn(`  Failed to drop table ${table}:`, error);
		}
	}

	console.log('Database reset complete');
}

async function main() {
	console.log('=== Test Data Reset Script ===\n');

	try {
		await deleteAllPolarCustomers();
		console.log('');
		await resetDatabase();
		console.log('\n=== Reset complete ===');
		console.log('Run `pnpm db:push` to recreate tables');
	} catch (error) {
		console.error('Reset failed:', error);
		process.exit(1);
	} finally {
		await sql.end();
	}
}

main();
