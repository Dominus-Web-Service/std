import { describe, expectTypeOf, test } from 'bun:test';

import { Exception } from '#/exception';
import { HttpException } from '#/http-exception';

describe('Generic type TCause', (): void => {
	test('Exception cause should be typed when generic is provided', (): void => {
		interface DbCause {
			code: number;
			query: string;
		}

		const error = new Exception<DbCause>('db failed', {
			cause: { code: 1001, query: 'SELECT *' }
		});

		expectTypeOf(error.cause).toEqualTypeOf<DbCause | undefined>();
	});

	test('Exception cause should default to unknown', (): void => {
		const error = new Exception('default');

		expectTypeOf(error.cause).toEqualTypeOf<unknown>();
	});

	test('HttpException cause should be typed when generic is provided', (): void => {
		interface ApiCause {
			endpoint: string;
			method: string;
		}

		const error = new HttpException<ApiCause>('api failed', {
			status: 'BAD_REQUEST',
			cause: { endpoint: '/users', method: 'POST' }
		});

		expectTypeOf(error.cause).toEqualTypeOf<ApiCause | undefined>();
	});

	test('const generic should preserve literal types', (): void => {
		const error = new Exception('literal', { cause: { status: 'failed' as const } });

		expectTypeOf(error.cause).toEqualTypeOf<{ readonly status: 'failed' } | undefined>();
	});
});
