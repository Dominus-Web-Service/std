import { describe, expect, test } from 'bun:test';

import { HTTP_STATUS_CODES } from '#/constant/http-status-codes';
import { Exception } from '#/exception';
import { HttpException } from '#/http-exception';

describe.concurrent('HttpException', (): void => {
	test('should extend Exception and Error', (): void => {
		const error = new HttpException('test');

		expect(error).toBeInstanceOf(HttpException);
		expect(error).toBeInstanceOf(Exception);
		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('HttpException');
	});

	test('should default to 500 when no init is provided', (): void => {
		const error = new HttpException('server error');

		expect(error.httpStatusCode).toBe(500);
		expect(error.message).toBe('server error');
		expect(error.cause).toBeUndefined();
	});

	test('should accept a numeric status code', (): void => {
		const error = new HttpException('not found', { status: 404 });

		expect(error.httpStatusCode).toBe(404);
	});

	test('should resolve a string status key to its numeric code', (): void => {
		const error = new HttpException('unauthorized', { status: 'UNAUTHORIZED' });

		expect(error.httpStatusCode).toBe(401);
	});

	test('should accept status, key, and cause together', (): void => {
		const cause = { field: 'email' };
		const error = new HttpException('validation failed', {
			status: 'BAD_REQUEST',
			key: 'VALIDATION_ERROR',
			cause
		});

		expect(error.httpStatusCode).toBe(400);
		expect(error.key).toBe('VALIDATION_ERROR');
		expect(error.cause).toBe(cause);
		expect(error.message).toBe('validation failed');
	});

	test('should default to 500 when status is omitted from init', (): void => {
		const cause = { details: 'missing token' };
		const error = new HttpException('auth failed', { cause });

		expect(error.httpStatusCode).toBe(500);
		expect(error.cause).toBe(cause);
	});

	test('should resolve every key in HTTP_STATUS_CODES', (): void => {
		const keys = Object.keys(HTTP_STATUS_CODES) as (keyof typeof HTTP_STATUS_CODES)[];

		for (const key of keys) {
			const error = new HttpException('test', { status: key });
			expect(error.httpStatusCode).toBe(HTTP_STATUS_CODES[key]);
		}
	});

	test('should be catchable with instanceof after throw', (): void => {
		expect((): void => {
			throw new HttpException('not found', { status: 'NOT_FOUND' });
		}).toThrow(HttpException);
	});
});
