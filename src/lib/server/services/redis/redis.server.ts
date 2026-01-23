import Redis from 'ioredis';
import { logger } from '../logger';
import { REDIS_URL } from '$env/static/private';
import { onShutdown } from '$services/lifecycle';

if (!REDIS_URL) {
	throw new Error('REDIS_URL environment variable is required');
}

export const redisClient = new Redis(REDIS_URL, {
	maxRetriesPerRequest: 3,
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
	lazyConnect: true,
	commandTimeout: 5000,
	connectTimeout: 10000,
	enableOfflineQueue: false
});

redisClient.on('error', (err) => {
	logger.error({ err }, 'Redis client error');
});

redisClient.on('connect', () => {
	logger.info('Redis client connected');
});

redisClient.on('ready', () => {
	logger.info('Redis client ready');
});

redisClient.on('close', () => {
	logger.warn('Redis connection closed');
});

redisClient.on('end', () => {
	logger.error('Redis connection ended permanently');
});

redisClient.on('reconnecting', (delay: number) => {
	logger.warn({ delay }, 'Redis client reconnecting');
});

export async function checkRedisHealth(): Promise<boolean> {
	try {
		return (await redisClient.ping()) === 'PONG';
	} catch {
		return false;
	}
}

onShutdown('Redis', () => redisClient.quit());
