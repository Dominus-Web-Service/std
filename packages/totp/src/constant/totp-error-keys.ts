export const TOTP_ERROR_KEYS = {
	INVALID_SECRET: 'totp.invalid_secret',
	INVALID_DIGITS: 'totp.invalid_digits',
	INVALID_PERIOD: 'totp.invalid_period',
	HMAC_FAILED: 'totp.hmac_failed',
	INVALID_BASE32: 'totp.invalid_base32'
} as const;
