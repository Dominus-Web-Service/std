import { t } from 'elysia';

export const rateLimitContract = {
	429: t.Object({
		message: t.String({
			description: 'Error message indicating that the rate limit has been exceeded.'
		})
	})
};
