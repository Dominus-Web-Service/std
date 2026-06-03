import { describe, expect, test } from 'bun:test';

import { generateHOTP } from '#/hotp';
import { BASE32_ALPHABET } from '#/util/base32';
import { generateOTPSecret } from '#/util/generate-secret';

describe.concurrent('generateOTPSecret', () => {
	test('should produce a secret of the requested length', () => {
		expect(generateOTPSecret(16)).toHaveLength(16);
		expect(generateOTPSecret(32)).toHaveLength(32);
	});

	test('should produce an empty string for length 0', () => {
		expect(generateOTPSecret(0)).toBe('');
	});

	test('should only use base32 alphabet characters', () => {
		const secret = generateOTPSecret(256);
		for (const char of secret) expect(BASE32_ALPHABET).toContain(char);
	});

	test('should be usable as an HOTP secret', async () => {
		const secret = generateOTPSecret(32);
		const otp = await generateHOTP({ secret, counter: 0 });
		expect(otp).toMatch(/^\d{6}$/);
	});
});
