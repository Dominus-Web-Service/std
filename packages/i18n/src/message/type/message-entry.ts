/**
 * Blueprint for a translatable message.
 *
 * Used inside a message catalog created with `defineMessageCatalog`.
 *
 * @template TParams - Parameter placeholders the message expects (e.g. `{ domain: string }`).
 * @template TLocales - Locale keys that must be provided (e.g. `'en' | 'fr'`).
 */
export interface MessageEntry<
	TParams extends Record<string, string> = Record<string, string>,
	TLocales extends string = string
> {
	/** Translated strings keyed by locale. */
	readonly translations: Readonly<Record<TLocales, string>>;

	/** Placeholder values to interpolate into the translated string. */
	readonly params?: TParams;
}
