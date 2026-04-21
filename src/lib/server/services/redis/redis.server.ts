import { Redis } from 'ioredis';

import { env } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

export const redisClient = new Redis(env.REDIS_URL, {
	lazyConnect: true,
	maxRetriesPerRequest: 3
});

onShutdown('redis', async () => {
	await redisClient.quit();
});
