/**
 * Redis Session Storage Adapter for better-auth
 *
 * Implements SecondaryStorage interface for faster session lookups.
 * Falls back gracefully to DB when Redis is unavailable.
 */

import type { SecondaryStorage } from 'better-auth';

import { logger } from '$services/logger';
import { redisClient } from '$services/redis';

const SESSION_PREFIX = 'session:';
const MAX_KEY_LENGTH = 256;
const DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function isValidKey(key: string): boolean {
	if (!key || key.length > MAX_KEY_LENGTH) return false;
	return /^[a-zA-Z0-9_\-.:]+$/.test(key);
}

export function createSessionStorage(): SecondaryStorage {
	return {
		async get(key: string): Promise<string | null> {
			if (!isValidKey(key)) {
				logger.warn({ key: key.substring(0, 50) }, 'Invalid session key');
				return null;
			}
			try {
				return await redisClient.get(SESSION_PREFIX + key);
			} catch (err) {
				logger.warn({ err, key }, 'Session get failed');
				return null;
			}
		},
		async set(key: string, value: string, ttl?: number): Promise<void> {
			if (!isValidKey(key)) {
				logger.warn({ key: key.substring(0, 50) }, 'Invalid session key');
				return;
			}
			try {
				const seconds = ttl ?? DEFAULT_TTL_SECONDS;
				await redisClient.set(SESSION_PREFIX + key, value, 'EX', seconds);
			} catch (err) {
				logger.warn({ err, key }, 'Session set failed');
			}
		},
		async delete(key: string): Promise<void> {
			if (!isValidKey(key)) {
				logger.warn({ key: key.substring(0, 50) }, 'Invalid session key');
				return;
			}
			try {
				await redisClient.del(SESSION_PREFIX + key);
			} catch (err) {
				logger.warn({ err, key }, 'Session delete failed');
			}
		}
	};
}
