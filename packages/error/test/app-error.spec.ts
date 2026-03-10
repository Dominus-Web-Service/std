import { describe, expect, test } from 'bun:test';

import { AppError } from '../src/app-error';

describe.concurrent('AppError', (): void => {
	test('should be an instance of Error and AppError', (): void => {
		const error = new AppError('something broke');

		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(AppError);
	});

	test('should store message and cause', (): void => {
		const cause = { code: 'DB_TIMEOUT', query: 'SELECT *' };
		const error = new AppError('database failed', cause);

		expect(error.message).toBe('database failed');
		expect(error.cause).toBe(cause);
	});

	test('should have undefined cause when not provided', (): void => {
		const error = new AppError('no cause');

		expect(error.cause).toBeUndefined();
	});

	test('should set name to the actual class name via new.target', (): void => {
		class CustomError extends AppError {}

		expect(new AppError('a').name).toBe('AppError');
		expect(new CustomError('b').name).toBe('CustomError');
	});

	test('should generate a valid UUID v7', (): void => {
		const error = new AppError('uuid test');

		expect(error.uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		);
	});

	test('should generate unique UUIDs across instances', (): void => {
		const a = new AppError('a');
		const b = new AppError('b');

		expect(a.uuid).not.toBe(b.uuid);
	});

	test('should capture a date close to creation time', (): void => {
		const before = Date.now();
		const error = new AppError('date test');
		const after = Date.now();

		expect(error.date.getTime()).toBeGreaterThanOrEqual(before);
		expect(error.date.getTime()).toBeLessThanOrEqual(after);
	});

	test('should have a stack trace pointing to the error', (): void => {
		const error = new AppError('stack test');

		expect(error.stack).toContain('AppError');
	});

	test('should wrap an Error as cause and preserve its reference', (): void => {
		const original = new Error('root cause');
		const wrapped = new AppError('wrapper', original);

		expect(wrapped.cause).toBe(original);
	});

	test('should be catchable with instanceof after throw', (): void => {
		expect((): void => {
			throw new AppError('thrown');
		}).toThrow(AppError);
	});
});
