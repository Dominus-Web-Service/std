import { LocalizedHttpException } from './localized-http-exception';
import type { ExceptionEntry } from './type/exception-entry';

// oxlint-disable-next-line no-explicit-any
export type ExceptionCatalog<TDefs extends Record<string, ExceptionEntry<any>>> = {
	readonly [K in keyof TDefs]: TDefs[K] extends ExceptionEntry<infer P>
		? [P] extends [Record<string, never>]
			? () => LocalizedHttpException
			: (params: P) => LocalizedHttpException
		: never;
};

/**
 * Configuration for {@link defineExceptionCatalog}.
 *
 * @template TDefs - Shape of the exception definitions map.
 */
// oxlint-disable-next-line no-explicit-any
export interface DefineExceptionCatalogOptions<TDefs extends Record<string, ExceptionEntry<any>>> {
	/** Prefix prepended to every error key (e.g. `'dns'` → `'dns.invalidRecordType'`). */
	readonly namespace: string;

	/** Locale used to build the default `message` when no locale is specified. */
	readonly defaultLocale: keyof TDefs[keyof TDefs]['translations'];

	/** Map of exception definitions keyed by error name. */
	readonly definitions: TDefs;
}

/**
 * Builds a typed exception catalog from a set of {@link ExceptionEntry} definitions.
 *
 * Each key in `definitions` becomes a factory function that creates
 * a {@link LocalizedHttpException} pre-filled with the right translations,
 * HTTP status, and error key (`namespace.key`).
 *
 * @param options - Namespace, default locale, and exception definitions.
 *
 * @returns An object whose keys mirror `definitions`, each a factory function.
 */
// oxlint-disable-next-line no-explicit-any
export const defineExceptionCatalog = <const TDefs extends Record<string, ExceptionEntry<any>>>(
	options: DefineExceptionCatalogOptions<TDefs>
): ExceptionCatalog<TDefs> => {
	const { namespace, defaultLocale, definitions } = options;
	const catalog: Record<string, (params?: Record<string, string>) => LocalizedHttpException> = {};

	for (const [key, def] of Object.entries(definitions)) {
		// oxlint-disable-next-line no-explicit-any
		const exceptionDef: ExceptionEntry<any> = def;
		catalog[key] = (params: Record<string, string> = {}): LocalizedHttpException =>
			new LocalizedHttpException(`${namespace}.${key}`, {
				status: exceptionDef.status,
				translations: exceptionDef.translations,
				params,
				defaultLocale: defaultLocale as string
			});
	}

	return catalog as ExceptionCatalog<TDefs>;
};
