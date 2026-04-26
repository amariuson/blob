import { REDIS_URL } from '$env/static/private';

import { onShutdown } from '$services/lifecycle';
import { createLogger } from '$services/logger';
import { withSpan } from '$services/tracing';

import Redis from 'ioredis';

if (!REDIS_URL) {
	throw new Error('REDIS_URL environment variable is required');
}

const log = createLogger({ module: 'redis' });

export const redisClient = new Redis(REDIS_URL, {
	maxRetriesPerRequest: 3,
	retryStrategy: (times) => Math.min(times * 50, 2000),
	lazyConnect: true,
	commandTimeout: 5000,
	connectTimeout: 10000,
	enableOfflineQueue: false
});

redisClient.on('error', (err) => log.error({ err }, 'Redis client error'));
redisClient.on('connect', () => log.info('Redis client connected'));
redisClient.on('ready', () => log.info('Redis client ready'));
redisClient.on('close', () => log.warn('Redis connection closed'));
redisClient.on('end', () => log.error('Redis connection ended permanently'));
redisClient.on('reconnecting', (delay: number) => log.warn({ delay }, 'Redis client reconnecting'));

export async function checkRedisHealth(): Promise<boolean> {
	return withSpan('redis.ping', {}, async () => {
		try {
			return (await redisClient.ping()) === 'PONG';
		} catch (err) {
			log.warn({ err }, 'Redis health check failed');
			return false;
		}
	});
}

onShutdown('Redis', () => redisClient.quit());
