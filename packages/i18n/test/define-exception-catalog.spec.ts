import { describe, expect, test } from 'bun:test';

import { defineExceptionCatalog } from '#/exception/define-exception-catalog';
import { LocalizedHttpException } from '#/exception/localized-http-exception';
import { resolveMessage } from '#/resolve-message';
import { entry } from '#/entry';

describe.concurrent('defineExceptionCatalog', (): void => {
	test('should return an object with factory functions for each definition', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				simple: entry({
					status: 'NOT_FOUND',
					translations: { en: 'Not found' }
				})
			}
		});

		expect(typeof catalog.simple).toBe('function');
	});

	test('should produce a LocalizedHttpException from a no-param entry', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				simple: entry({
					status: 'NOT_FOUND',
					translations: { en: 'Not found', fr: 'Introuvable' }
				})
			}
		});

		const error = catalog.simple();

		expect(error).toBeInstanceOf(LocalizedHttpException);
		expect(error.message).toBe('Not found');
		expect(error.httpStatusCode).toBe(404);
	});

	test('should set key to namespace.key', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				simple: entry({
					status: 'NOT_FOUND',
					translations: { en: 'Not found' }
				})
			}
		});

		expect(catalog.simple().key).toBe('test.simple');
	});

	test('should not interpolate params in the exception message', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				withParams: entry<{ id: string }>({
					status: 'BAD_REQUEST',
					translations: { en: 'Invalid id: {{id}}' }
				})
			}
		});

		expect(catalog.withParams({ id: '42' }).message).toBe('Invalid id: {{id}}');
	});

	test('should not interpolate multiple params in the exception message', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				range: entry<{ min: string; max: string }>({
					status: 'BAD_REQUEST',
					translations: { en: 'Value must be between {{min}} and {{max}}' }
				})
			}
		});

		expect(catalog.range({ min: '1', max: '100' }).message).toBe(
			'Value must be between {{min}} and {{max}}'
		);
	});

	test('should allow resolving the exception to a different locale', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				withParams: entry<{ id: string }>({
					status: 'BAD_REQUEST',
					translations: {
						en: 'Invalid id: {{id}}',
						fr: 'Identifiant invalide : {{id}}'
					}
				})
			}
		});

		const error = catalog.withParams({ id: '42' });

		expect(resolveMessage(error, 'fr')).toBe('Identifiant invalide : 42');
	});

	test('should store the correct defaultLocale', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'fr',
			definitions: {
				msg: entry({
					status: 'OK',
					translations: { en: 'OK', fr: 'OK' }
				})
			}
		});

		expect(catalog.msg().defaultLocale).toBe('fr');
	});

	test('should store translations on the exception', (): void => {
		const translations = { en: 'Not found', fr: 'Introuvable' } as const;
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				simple: entry({ status: 'NOT_FOUND', translations })
			}
		});

		expect(catalog.simple().translations).toEqual(translations);
	});

	test('each invocation should produce a distinct exception instance', (): void => {
		const catalog = defineExceptionCatalog({
			namespace: 'test',
			defaultLocale: 'en',
			definitions: {
				simple: entry({
					status: 'NOT_FOUND',
					translations: { en: 'Not found' }
				})
			}
		});

		const a = catalog.simple();
		const b = catalog.simple();

		expect(a).not.toBe(b);
		expect(a.uuid).not.toBe(b.uuid);
	});

	test('should respect the namespace across different catalogs', (): void => {
		const authCatalog = defineExceptionCatalog({
			namespace: 'auth',
			defaultLocale: 'en',
			definitions: {
				denied: entry({
					status: 'FORBIDDEN',
					translations: { en: 'Access denied' }
				})
			}
		});

		const dnsCatalog = defineExceptionCatalog({
			namespace: 'dns',
			defaultLocale: 'en',
			definitions: {
				denied: entry({
					status: 'FORBIDDEN',
					translations: { en: 'Access denied' }
				})
			}
		});

		expect(authCatalog.denied().key).toBe('auth.denied');
		expect(dnsCatalog.denied().key).toBe('dns.denied');
	});
});
