import type { MessageEntry } from './type/message-entry';
import type { ResolvedMessage } from './type/resolved-message';

// oxlint-disable-next-line no-explicit-any
export type MessageCatalog<TDefs extends Record<string, MessageEntry<any>>> = {
	readonly [K in keyof TDefs]: TDefs[K] extends MessageEntry<infer P>
		? [P] extends [Record<string, never>]
			? () => ResolvedMessage
			: (params: P) => ResolvedMessage
		: never;
};

/**
 * Configuration for {@link defineMessageCatalog}.
 *
 * @template TDefs - Shape of the message definitions map.
 */
// oxlint-disable-next-line no-explicit-any
export interface DefineMessageCatalogOptions<TDefs extends Record<string, MessageEntry<any>>> {
	/** Locale used when no explicit locale is passed to `resolveMessage`. */
	readonly defaultLocale: keyof TDefs[keyof TDefs]['translations'];

	/** Map of message definitions keyed by message name. */
	readonly definitions: TDefs;
}

/**
 * Builds a typed message catalog from a set of {@link MessageEntry} definitions.
 *
 * Each key in `definitions` becomes a factory function that creates
 * a {@link ResolvedMessage} pre-filled with the right translations and default locale.
 *
 * @param options - Default locale and message definitions.
 *
 * @returns An object whose keys mirror `definitions`, each a factory function.
 */
// oxlint-disable-next-line no-explicit-any
export const defineMessageCatalog = <TDefs extends Record<string, MessageEntry<any>>>(
	options: DefineMessageCatalogOptions<TDefs>
): MessageCatalog<TDefs> => {
	const catalog: Record<string, (params?: Record<string, string>) => ResolvedMessage> = {};

	for (const [key, def] of Object.entries(options.definitions)) {
		// oxlint-disable-next-line no-explicit-any
		const msgDef: MessageEntry<any> = def;
		catalog[key] = (params: Record<string, string> = {}): ResolvedMessage => ({
			translations: msgDef.translations,
			params,
			defaultLocale: options.defaultLocale as string
		});
	}

	return catalog as MessageCatalog<TDefs>;
};
