import { describe, expectTypeOf, test } from 'bun:test';

import { AppError } from '#/app-error';
import { HttpError } from '#/http-error';

describe('Generic type TCause', (): void => {
	test('AppError cause should be typed when generic is provided', (): void => {
		interface DbCause {
			code: number;
			query: string;
		}

		const error = new AppError<DbCause>('db failed', { code: 1001, query: 'SELECT *' });

		expectTypeOf(error.cause).toEqualTypeOf<DbCause | undefined>();
	});

	test('AppError cause should default to unknown', (): void => {
		const error = new AppError('default');

		expectTypeOf(error.cause).toEqualTypeOf<unknown>();
	});

	test('HttpError cause should be typed when generic is provided', (): void => {
		interface ApiCause {
			endpoint: string;
			method: string;
		}

		const error = new HttpError<ApiCause>('api failed', 'BAD_REQUEST', {
			endpoint: '/users',
			method: 'POST'
		});

		expectTypeOf(error.cause).toEqualTypeOf<ApiCause | undefined>();
	});

	test('const generic should preserve literal types', (): void => {
		const error = new AppError('literal', { status: 'failed' as const });

		expectTypeOf(error.cause).toEqualTypeOf<{ readonly status: 'failed' } | undefined>();
	});
});
