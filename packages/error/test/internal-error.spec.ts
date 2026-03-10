import { describe, expect, test } from 'bun:test';

import { AppError } from '../src/app-error';
import { InternalError } from '../src/internal-error';

describe.concurrent('InternalError', (): void => {
	test('should extend AppError and Error', (): void => {
		const error = new InternalError('db connection lost');

		expect(error).toBeInstanceOf(InternalError);
		expect(error).toBeInstanceOf(AppError);
		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('InternalError');
	});

	test('should store message and cause', (): void => {
		const cause = new Error('ECONNREFUSED');
		const error = new InternalError('redis unavailable', cause);

		expect(error.message).toBe('redis unavailable');
		expect(error.cause).toBe(cause);
	});

	test('should have undefined cause when not provided', (): void => {
		const error = new InternalError('disk full');

		expect(error.cause).toBeUndefined();
	});

	test('should be distinguishable from AppError via instanceof', (): void => {
		const internal = new InternalError('internal');
		const base = new AppError('base');

		expect(internal).toBeInstanceOf(AppError);
		expect(base).not.toBeInstanceOf(InternalError);
	});

	test('should be catchable with instanceof after throw', (): void => {
		expect((): void => {
			throw new InternalError('thrown');
		}).toThrow(InternalError);
	});
});
