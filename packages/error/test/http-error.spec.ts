import { describe, expect, test } from 'bun:test';

import { AppError } from '../src/app-error';
import { HTTP_STATUS_CODES } from '../src/enums/http-status-codes';
import { HttpError } from '../src/http-error';

describe.concurrent('HttpError', (): void => {
	test('should extend AppError and Error', (): void => {
		const error = new HttpError('test');

		expect(error).toBeInstanceOf(HttpError);
		expect(error).toBeInstanceOf(AppError);
		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('HttpError');
	});

	describe.concurrent('constructor overloads', (): void => {
		test('should default to 500 when only message is provided', (): void => {
			const error = new HttpError('server error');

			expect(error.httpStatusCode).toBe(500);
			expect(error.message).toBe('server error');
			expect(error.cause).toBeUndefined();
		});

		test('should accept a numeric status code', (): void => {
			const error = new HttpError('not found', 404);

			expect(error.httpStatusCode).toBe(404);
			expect(error.cause).toBeUndefined();
		});

		test('should resolve a string status key to its numeric code', (): void => {
			const error = new HttpError('unauthorized', 'UNAUTHORIZED');

			expect(error.httpStatusCode).toBe(401);
		});

		test('should accept message + status + cause', (): void => {
			const cause = { field: 'email' };
			const error = new HttpError('validation failed', 'BAD_REQUEST', cause);

			expect(error.httpStatusCode).toBe(400);
			expect(error.cause).toBe(cause);
			expect(error.message).toBe('validation failed');
		});

		test('should treat an object second arg as cause (not status)', (): void => {
			const cause = { details: 'missing token' };
			const error = new HttpError('auth failed', cause);

			expect(error.httpStatusCode).toBe(500);
			expect(error.cause).toBe(cause);
		});

		test('should default to 500 for an invalid status key', (): void => {
			const error = new HttpError(
				'bad key',
				'INVALID_STATUS' as keyof typeof HTTP_STATUS_CODES
			);

			expect(error.httpStatusCode).toBe(500);
		});
	});

	describe.concurrent('is_client_error / is_server_error', (): void => {
		test('should classify 4xx codes as client errors', (): void => {
			const codes: (keyof typeof HTTP_STATUS_CODES)[] = [
				'BAD_REQUEST',
				'UNAUTHORIZED',
				'FORBIDDEN',
				'NOT_FOUND',
				'CONFLICT',
				'UNPROCESSABLE_ENTITY',
				'TOO_MANY_REQUESTS'
			];

			for (const code of codes) {
				const error = new HttpError('client err', code);
				expect(error.is_client_error).toBe(true);
				expect(error.is_server_error).toBe(false);
			}
		});

		test('should classify 5xx codes as server errors', (): void => {
			const codes: (keyof typeof HTTP_STATUS_CODES)[] = [
				'INTERNAL_SERVER_ERROR',
				'BAD_GATEWAY',
				'SERVICE_UNAVAILABLE',
				'GATEWAY_TIMEOUT'
			];

			for (const code of codes) {
				const error = new HttpError('server err', code);
				expect(error.is_server_error).toBe(true);
				expect(error.is_client_error).toBe(false);
			}
		});

		test('should classify 2xx/3xx as neither client nor server error', (): void => {
			const error = new HttpError('ok', 200);

			expect(error.is_client_error).toBe(false);
			expect(error.is_server_error).toBe(false);
		});
	});

	test('should resolve every key in HTTP_STATUS_CODES', (): void => {
		const keys = Object.keys(HTTP_STATUS_CODES) as (keyof typeof HTTP_STATUS_CODES)[];

		for (const key of keys) {
			const error = new HttpError('test', key);
			expect(error.httpStatusCode).toBe(HTTP_STATUS_CODES[key]);
		}
	});

	test('should be catchable with instanceof after throw', (): void => {
		expect((): void => {
			throw new HttpError('not found', 'NOT_FOUND');
		}).toThrow(HttpError);
	});
});
