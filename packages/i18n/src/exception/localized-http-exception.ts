import { HttpException, type HttpExceptionOptions } from '@dws-std/error';

import { resolveMessage } from '../resolve-message';
import type { Translations } from '../type/translations';

/**
 * Options accepted by the {@link LocalizedHttpException} constructor.
 *
 * @template TCause - Type of the underlying cause.
 */
export interface LocalizedHttpExceptionOptions<
	TCause = unknown
> extends HttpExceptionOptions<TCause> {
	/** All available translations keyed by locale. */
	readonly translations: Translations;

	/** Parameter values to interpolate into `{{placeholder}}` tokens. */
	readonly params?: Readonly<Record<string, string>> | undefined;

	/** Locale used to build the default `message` string. */
	readonly defaultLocale: string;
}

/**
 * HTTP exception that carries translated messages.
 *
 * The `message` property is automatically resolved to the default locale.
 * Use {@link resolveMessage} to get a translation in a different locale.
 *
 * @template TCause - Type of the underlying cause.
 */
export class LocalizedHttpException<const TCause = unknown> extends HttpException<TCause> {
	/** All available translations keyed by locale. */
	public readonly translations: Translations;

	/** Parameter values interpolated into `{{placeholder}}` tokens. */
	public readonly params: Readonly<Record<string, string>> | undefined;

	/** Locale used to build the default `message` string. */
	public readonly defaultLocale: string;

	/**
	 * Creates a new localized HTTP exception.
	 *
	 * @param code - Application-specific error code (e.g. `'dns.invalidRecordType'`).
	 * @param init - Translations, params, status, and cause.
	 */
	public constructor(code: string, init: LocalizedHttpExceptionOptions<TCause>) {
		super(
			resolveMessage({
				translations: init.translations,
				params: init.params,
				defaultLocale: init.defaultLocale
			}),
			{
				cause: init.cause,
				status: init.status,
				code
			}
		);
		this.translations = init.translations;
		this.params = init.params;
		this.defaultLocale = init.defaultLocale;
	}
}
