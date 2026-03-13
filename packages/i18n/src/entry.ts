import type { HttpStatusCode, HttpStatusKey } from '@dws-std/error';

import type { ExceptionEntry } from './exception/type/exception-entry';
import type { MessageEntry } from './message/type/message-entry';

/**
 * Creates a single catalog entry for use inside `defineExceptionCatalog` or `defineMessageCatalog`.
 *
 * When `status` is included in the definition the return type narrows to
 * {@link ExceptionEntry}; without it the return type is {@link MessageEntry}.
 *
 * @param definition - Translations (and optional status) for this entry.
 * 
 * @returns The definition object, typed as either {@link ExceptionEntry} or {@link MessageEntry} based on the presence of `status`.
 */
export function entry<
	TParams extends Record<string, string> = Record<string, string>,
	TLocales extends string = string
>(definition: {
	readonly status: HttpStatusKey | HttpStatusCode;
	readonly translations: Readonly<Record<TLocales, string>>;
}): ExceptionEntry<TParams, TLocales>;

export function entry<
	TParams extends Record<string, string> = Record<string, string>,
	TLocales extends string = string
>(definition: {
	readonly translations: Readonly<Record<TLocales, string>>;
}): MessageEntry<TParams, TLocales>;

export function entry<
	TParams extends Record<string, string> = Record<string, string>,
	TLocales extends string = string
>(definition: {
	readonly status?: HttpStatusKey | HttpStatusCode;
	readonly translations: Readonly<Record<TLocales, string>>;
}): ExceptionEntry<TParams, TLocales> | MessageEntry<TParams, TLocales> {
	return definition;
}
