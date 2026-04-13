import { Exception } from '@dws-std/error';
import { RedisClient, type RedisOptions } from 'bun';

import { KvStore } from './kv-store';

export const BUN_REDIS_STORE_ERROR_KEYS = {
	CONNECTION_FAILED: 'kv-store.bun-redis-store.connection-failed'
} as const;

export class BunRedisStore extends KvStore {
	/**
	 * Redis client instance. Initialized in the constructor and connected in the `connect` method.
	 */
	private _redis: RedisClient;

	public constructor(url?: string, options?: RedisOptions) {
		super();
		this._redis = new RedisClient(url, options);
	}

	public override async connect(): Promise<void> {
		try {
			await this._redis.connect();
		} catch (error) {
			throw new Exception('Failed to connect to Redis', {
				key: BUN_REDIS_STORE_ERROR_KEYS.CONNECTION_FAILED,
				cause: error instanceof Error ? error : new Error(String(error))
			});
		}
	}

	public override close(): void {
		this._redis.close();
	}

	public override async get<T = unknown>(key: string): Promise<T | null> {
		KvStore._validateKey(key);

		const value = await this._redis.get(key);
		if (value === null) return null;

		try {
			const parsed: unknown = JSON.parse(value);
			return parsed as T;
		} catch {
			return value as T;
		}
	}

	public override async set<T = unknown>(key: string, value: T, ttlSec?: number): Promise<void> {
		KvStore._validateKey(key);
		KvStore._validateTtl(ttlSec);

		const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
		if (ttlSec) await this._redis.set(key, stringValue, 'EX', ttlSec);
		else await this._redis.set(key, stringValue);
	}

	public override increment(key: string, amount = 1): Promise<number> {
		KvStore._validateKey(key);
		KvStore._validateAmount(amount);
		return this._redis.incrby(key, amount);
	}

	public override decrement(key: string, amount = 1): Promise<number> {
		KvStore._validateKey(key);
		KvStore._validateAmount(amount);
		return this._redis.decrby(key, amount);
	}

	public override del(key: string): Promise<boolean> {
		KvStore._validateKey(key);
		return this._redis.del(key).then((result) => result > 0);
	}

	public override expire(key: string, ttlSec: number): Promise<boolean> {
		KvStore._validateKey(key);
		KvStore._validateTtl(ttlSec);
		return this._redis.expire(key, ttlSec).then((result) => result > 0);
	}

	public override ttl(key: string): Promise<number> {
		KvStore._validateKey(key);
		return this._redis.ttl(key);
	}

	public override async clean(): Promise<number> {
		const dbSize: number = (await this._redis.send('DBSIZE', [])) as number;
		await this._redis.send('FLUSHDB', ['ASYNC']);
		return dbSize;
	}
}
