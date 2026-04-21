import { instrumentDrizzleClient } from '@kubiks/otel-drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '$lib/server/env.server';

import * as schema from './schema';

const client = postgres(env.DATABASE_URL);

export const db = instrumentDrizzleClient(drizzle(client, { schema }));
