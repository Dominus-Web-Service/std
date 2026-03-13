import type { HttpStatusCode, HttpStatusKey } from '@dws-std/error';

/**
 * Blueprint for a translatable HTTP exception.
 *
 * Used inside an exception catalog created with `defineExceptionCatalog`.
 *
 * @template TParams - Parameter placeholders the message expects (e.g. `{ field: string }`).
 * @template TLocales - Locale keys that must be provided (e.g. `'en' | 'fr'`).
 */
export interface ExceptionEntry<
	TParams extends Record<string, string> = Record<string, string>,
	TLocales extends string = string
> {
	/** HTTP status to attach (key name like `'NOT_FOUND'` or numeric code like `404`). */
	readonly status: HttpStatusKey | HttpStatusCode;

	/** Translated error messages keyed by locale. */
	readonly translations: Readonly<Record<TLocales, string>>;

	/** Placeholder values to interpolate into the translated string. */
	readonly params?: TParams;
}
