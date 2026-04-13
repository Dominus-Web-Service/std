// oxlint-disable promise/no-await-in-loop
import { describe, expect, test } from 'bun:test';
import { Elysia } from 'elysia';

import { RATE_LIMIT_ERROR_KEYS, rateLimitPlugin } from '#/rate-limit';

describe.concurrent('rateLimitPlugin', () => {
	test('should return correct rate limit headers for valid requests', async () => {
		const ip = '127.0.0.1';
		const limit = 3;
		const app = new Elysia().use(rateLimitPlugin()).get('/test', () => 'OK', {
			rateLimit: {
				limit,
				window: 60
			}
		});

		for (let i = 0; i < limit; ++i) {
			const response = await app.handle(
				new Request('http://localhost/test', {
					headers: { 'x-forwarded-for': ip }
				})
			);
			expect(response.status).toEqual(200);
			expect(response.headers.get('X-RateLimit-Limit')).toEqual(limit.toString());
			expect(response.headers.get('X-RateLimit-Remaining')).toEqual(
				(limit - i - 1).toString()
			);
			expect(parseInt(response.headers.get('X-RateLimit-Reset') ?? '0', 10)).toBeGreaterThan(
				0
			);
		}
	});

	test('should return 429 when rate limit is exceeded', async () => {
		const ip = '10.0.0.1';
		const limit = 2;
		const app = new Elysia()
			.use(rateLimitPlugin())
			.onError(({ error, set }) => {
				set.status = 429;
				return { error: (error as unknown as { key?: string }).key ?? 'unknown' };
			})
			.get('/limited', () => 'OK', {
				rateLimit: { limit, window: 60 }
			});

		for (let i = 0; i < limit; ++i)
			await app.handle(
				new Request('http://localhost/limited', {
					headers: { 'x-forwarded-for': ip }
				})
			);

		const response = await app.handle(
			new Request('http://localhost/limited', {
				headers: { 'x-forwarded-for': ip }
			})
		);

		expect(response.status).toEqual(429);
		const body = (await response.json()) as { error: string };
		expect(body.error).toEqual(RATE_LIMIT_ERROR_KEYS.RATE_LIMIT_EXCEEDED);
		expect(response.headers.get('X-RateLimit-Remaining')).toEqual('0');
	});

	test('should track different IPs separately', async () => {
		const limit = 1;
		const app = new Elysia().use(rateLimitPlugin()).get('/per-ip', () => 'OK', {
			rateLimit: { limit, window: 60 }
		});

		const responseA = await app.handle(
			new Request('http://localhost/per-ip', {
				headers: { 'x-forwarded-for': '1.1.1.1' }
			})
		);
		expect(responseA.status).toEqual(200);

		const responseB = await app.handle(
			new Request('http://localhost/per-ip', {
				headers: { 'x-forwarded-for': '2.2.2.2' }
			})
		);
		expect(responseB.status).toEqual(200);
	});

	test('should extract the first IP from x-forwarded-for', async () => {
		const limit = 1;
		const app = new Elysia()
			.use(rateLimitPlugin())
			.onError(({ set }) => {
				set.status = 429;
				return 'limited';
			})
			.get('/xff', () => 'OK', {
				rateLimit: { limit, window: 60 }
			});

		// First request with chained IPs
		const response1 = await app.handle(
			new Request('http://localhost/xff', {
				headers: { 'x-forwarded-for': '3.3.3.3, 10.0.0.1, 192.168.1.1' }
			})
		);
		expect(response1.status).toEqual(200);

		// Second request from same client IP (first in chain) should be limited
		const response2 = await app.handle(
			new Request('http://localhost/xff', {
				headers: { 'x-forwarded-for': '3.3.3.3, 10.0.0.2' }
			})
		);
		expect(response2.status).toEqual(429);
	});

	test('should track different routes independently', async () => {
		const limit = 1;
		const app = new Elysia()
			.use(rateLimitPlugin())
			.get('/route-a', () => 'A', { rateLimit: { limit, window: 60 } })
			.get('/route-b', () => 'B', { rateLimit: { limit, window: 60 } });

		const ip = '5.5.5.5';

		const responseA = await app.handle(
			new Request('http://localhost/route-a', {
				headers: { 'x-forwarded-for': ip }
			})
		);
		expect(responseA.status).toEqual(200);

		const responseB = await app.handle(
			new Request('http://localhost/route-b', {
				headers: { 'x-forwarded-for': ip }
			})
		);
		expect(responseB.status).toEqual(200);
	});

	test('should fall back to x-real-ip when x-forwarded-for is absent', async () => {
		const limit = 1;
		const app = new Elysia()
			.use(rateLimitPlugin())
			.onError(({ set }) => {
				set.status = 429;
				return 'limited';
			})
			.get('/real-ip', () => 'OK', {
				rateLimit: { limit, window: 60 }
			});

		const response1 = await app.handle(
			new Request('http://localhost/real-ip', {
				headers: { 'x-real-ip': '7.7.7.7' }
			})
		);
		expect(response1.status).toEqual(200);

		const response2 = await app.handle(
			new Request('http://localhost/real-ip', {
				headers: { 'x-real-ip': '7.7.7.7' }
			})
		);
		expect(response2.status).toEqual(429);
	});

	test('should use custom keyGenerator for rate limiting', async () => {
		const limit = 1;
		const app = new Elysia()
			.use(rateLimitPlugin())
			.onError(({ set }) => {
				set.status = 429;
				return 'limited';
			})
			.get('/custom-key', () => 'OK', {
				rateLimit: {
					limit,
					window: 60,
					keyGenerator: ({ ip, request }) =>
						`${ip}:${request.headers.get('authorization') ?? 'anon'}`
				}
			});

		// Same IP, different tokens — should NOT share the limit
		const response1 = await app.handle(
			new Request('http://localhost/custom-key', {
				headers: { 'x-forwarded-for': '8.8.8.8', authorization: 'Bearer token-a' }
			})
		);
		expect(response1.status).toEqual(200);

		const response2 = await app.handle(
			new Request('http://localhost/custom-key', {
				headers: { 'x-forwarded-for': '8.8.8.8', authorization: 'Bearer token-b' }
			})
		);
		expect(response2.status).toEqual(200);

		// Same IP + same token — should be limited
		const response3 = await app.handle(
			new Request('http://localhost/custom-key', {
				headers: { 'x-forwarded-for': '8.8.8.8', authorization: 'Bearer token-a' }
			})
		);
		expect(response3.status).toEqual(429);
	});

	test('should rate limit by session when keyGenerator uses session id', async () => {
		const limit = 1;
		const app = new Elysia()
			.use(rateLimitPlugin())
			.onError(({ set }) => {
				set.status = 429;
				return 'limited';
			})
			.get('/session', () => 'OK', {
				rateLimit: {
					limit,
					window: 60,
					keyGenerator: ({ request }) => request.headers.get('x-session-id') ?? 'unknown'
				}
			});

		// Same IP but different sessions — should NOT share the limit
		const response1 = await app.handle(
			new Request('http://localhost/session', {
				headers: { 'x-forwarded-for': '9.9.9.9', 'x-session-id': 'sess-1' }
			})
		);
		expect(response1.status).toEqual(200);

		const response2 = await app.handle(
			new Request('http://localhost/session', {
				headers: { 'x-forwarded-for': '9.9.9.9', 'x-session-id': 'sess-2' }
			})
		);
		expect(response2.status).toEqual(200);

		// Same session — should be limited
		const response3 = await app.handle(
			new Request('http://localhost/session', {
				headers: { 'x-forwarded-for': '9.9.9.9', 'x-session-id': 'sess-1' }
			})
		);
		expect(response3.status).toEqual(429);
	});

	test('should rate limit authenticated routes by ip + accessToken', async () => {
		const limit = 2;
		const sharedIp = '42.42.42.42';
		const app = new Elysia()
			.use(rateLimitPlugin())
			.onError(({ set }) => {
				set.status = 429;
				return 'limited';
			})
			.get('/api/data', () => 'OK', {
				rateLimit: {
					limit,
					window: 60,
					keyGenerator: ({ ip, request }) =>
						`${ip}:${request.headers.get('authorization') ?? ip}`
				}
			});

		// User A (same office IP) exhausts their limit
		for (let i = 0; i < limit; ++i) {
			const response = await app.handle(
				new Request('http://localhost/api/data', {
					headers: {
						'x-forwarded-for': sharedIp,
						authorization: 'Bearer access-user-a'
					}
				})
			);
			expect(response.status).toEqual(200);
		}

		// User A is now limited
		const blockedA = await app.handle(
			new Request('http://localhost/api/data', {
				headers: {
					'x-forwarded-for': sharedIp,
					authorization: 'Bearer access-user-a'
				}
			})
		);
		expect(blockedA.status).toEqual(429);

		// User B on the same IP still has their own budget
		for (let i = 0; i < limit; ++i) {
			const response = await app.handle(
				new Request('http://localhost/api/data', {
					headers: {
						'x-forwarded-for': sharedIp,
						authorization: 'Bearer access-user-b'
					}
				})
			);
			expect(response.status).toEqual(200);
		}

		// User B is now also limited
		const blockedB = await app.handle(
			new Request('http://localhost/api/data', {
				headers: {
					'x-forwarded-for': sharedIp,
					authorization: 'Bearer access-user-b'
				}
			})
		);
		expect(blockedB.status).toEqual(429);
	});
});
