import { describe, expect, test } from 'bun:test';

import { Exception } from '#/exception';

describe.concurrent('Exception', (): void => {
	test('should be an instance of Error and Exception', (): void => {
		const error = new Exception('something broke');

		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(Exception);
	});

	test('should store message', (): void => {
		const error = new Exception('database failed');

		expect(error.message).toBe('database failed');
	});

	test('should store cause from init', (): void => {
		const cause = { code: 'DB_TIMEOUT', query: 'SELECT *' };
		const error = new Exception('database failed', { cause });

		expect(error.cause).toBe(cause);
	});

	test('should have undefined cause when not provided', (): void => {
		const error = new Exception('no cause');

		expect(error.cause).toBeUndefined();
	});

	test('should store code from init', (): void => {
		const error = new Exception('not allowed', { code: 'AUTH_DENIED' });

		expect(error.code).toBe('AUTH_DENIED');
	});

	test('should have undefined code when not provided', (): void => {
		const error = new Exception('no code');

		expect(error.code).toBeUndefined();
	});

	test('should accept both code and cause together', (): void => {
		const cause = new Error('root');
		const error = new Exception('combined', { code: 'WRAPPED', cause });

		expect(error.code).toBe('WRAPPED');
		expect(error.cause).toBe(cause);
	});

	test('should set name to the actual class name via new.target', (): void => {
		class CustomError extends Exception {}

		expect(new Exception('a').name).toBe('Exception');
		expect(new CustomError('b').name).toBe('CustomError');
	});

	test('should generate a valid UUID v7', (): void => {
		const error = new Exception('uuid test');

		expect(error.uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		);
	});

	test('should generate unique UUIDs across instances', (): void => {
		const a = new Exception('a');
		const b = new Exception('b');

		expect(a.uuid).not.toBe(b.uuid);
	});

	test('should capture a date close to creation time', (): void => {
		const before = Date.now();
		const error = new Exception('date test');
		const after = Date.now();

		expect(error.date.getTime()).toBeGreaterThanOrEqual(before);
		expect(error.date.getTime()).toBeLessThanOrEqual(after);
	});

	test('should produce a stack trace excluding the constructor frame', (): void => {
		const error = new Exception('stack test');

		expect(error.stack).toBeDefined();
		expect(error.stack).not.toContain('new Exception');
	});

	test('should be catchable with instanceof after throw', (): void => {
		expect((): void => {
			throw new Exception('thrown');
		}).toThrow(Exception);
	});
});
