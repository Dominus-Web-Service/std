import type { LocalizedHttpException } from './exception/localized-http-exception';
import type { LocalizedMessage } from './message/type/localized-message';

const _interpolate = (template: string, params: Readonly<Record<string, string>>): string =>
	template.replace(
		/\{\{(\w+)\}\}/g,
		(_: string, key: string): string => params[key] ?? `{{${key}}}`
	);

/**
 * Turns a {@link LocalizedMessage} or {@link LocalizedHttpException} into
 * a plain string for the requested locale.
 *
 * `{{placeholder}}` tokens are replaced with matching values from `target.params`.
 * Falls back to `target.defaultLocale` when `locale` is omitted.
 * Returns an empty string when the requested locale has no translation.
 *
 * @param target - Message or exception to resolve.
 * @param locale - Desired locale (e.g. `'fr'`). Defaults to `target.defaultLocale`.
 *
 * @returns Translated string with placeholders interpolated.
 */
export const resolveMessage = (
	target: LocalizedHttpException | LocalizedMessage,
	locale?: string
): string =>
	target.params
		? _interpolate(target.translations[locale ?? target.defaultLocale] ?? '', target.params)
		: (target.translations[locale ?? target.defaultLocale] ?? '');
