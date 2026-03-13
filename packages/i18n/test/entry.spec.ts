import { describe, expect, test } from 'bun:test';

import { entry } from '#/entry';

describe.concurrent('entry', (): void => {
	test('should return the definition as-is when status is provided', (): void => {
		const def = entry({
			status: 'NOT_FOUND',
			translations: { en: 'Not found' }
		});

		expect(def).toEqual({
			status: 'NOT_FOUND',
			translations: { en: 'Not found' }
		});
	});

	test('should return the definition as-is when status is omitted', (): void => {
		const def = entry({
			translations: { en: 'Hello' }
		});

		expect(def).toEqual({
			translations: { en: 'Hello' }
		});
	});

	test('should accept a numeric status code', (): void => {
		const def = entry({
			status: 400,
			translations: { en: 'Bad' }
		});

		expect(def.status).toBe(400);
	});

	test('should preserve multi-locale translations', (): void => {
		const def = entry({
			translations: {
				en: 'Hello',
				fr: 'Bonjour',
				de: 'Hallo',
				es: 'Hola'
			}
		});

		expect(Object.keys(def.translations)).toHaveLength(4);
		expect(def.translations.fr).toBe('Bonjour');
	});
});
