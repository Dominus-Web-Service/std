import { timingSafeEqual as _cryptoTimingSafeEqual } from 'crypto';

const _textEncoder = new TextEncoder();

/**
 * Compares two strings in constant time to prevent timing attacks.
 *
 * @param a - First string to compare.
 * @param b - Second string to compare.
 *
 * @returns `true` if the strings are equal, `false` otherwise.
 */
export const timingSafeEqual = (a: string, b: string): boolean => {
	if (a.length !== b.length) return false;
	return _cryptoTimingSafeEqual(_textEncoder.encode(a), _textEncoder.encode(b));
};
