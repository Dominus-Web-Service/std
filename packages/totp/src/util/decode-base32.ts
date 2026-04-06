import { Exception } from '@dws-std/error';

import { TOTP_ERROR_KEYS } from '#/constant/totp-error-keys';

const _BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const _BASE32_CHARS = new Set(_BASE32_ALPHABET);

/**
 * Decodes a base32-encoded string into a Uint8Array (RFC 4648).
 *
 * @param input - The base32-encoded string to decode.
 *
 * @throws ({@link Exception}) – If the input contains invalid base32 characters.
 *
 * @returns The decoded bytes.
 */
export const decodeBase32 = (input: string): Uint8Array<ArrayBuffer> => {
	const sanitized = input.toUpperCase().replace(/[\s=]/g, '');

	for (const char of sanitized)
		if (!_BASE32_CHARS.has(char))
			throw new Exception(`Invalid base32 character: '${char}'`, {
				key: TOTP_ERROR_KEYS.INVALID_BASE32,
				cause: { input, invalidCharacter: char }
			});

	const output = new Uint8Array(Math.floor((sanitized.length * 5) / 8));
	let bits = 0;
	let value = 0;
	let index = 0;

	for (const char of sanitized) {
		value = (value << 5) | _BASE32_ALPHABET.indexOf(char);
		bits += 5;
		if (bits >= 8) {
			bits -= 8;
			output[index++] = (value >>> bits) & 0xff;
		}
	}

	return output;
};
