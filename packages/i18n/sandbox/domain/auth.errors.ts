import { defineExceptionCatalog, entry } from '../../src';

export const AUTH_ERRORS = defineExceptionCatalog({
	namespace: 'auth',
	defaultLocale: 'en',
	definitions: {
		invalidCredentials: entry({
			status: 'UNAUTHORIZED',
			translations: {
				de: 'Ungültige Anmeldedaten',
				en: 'Invalid credentials',
				es: 'Credenciales inválidas',
				fr: 'Identifiants invalides',
				it: 'Credenziali non valide'
			}
		}),

		// sessionExpired: entry({
		// 	status: 'UNAUTHORIZED',
		// 	translations: {
		// 		de: 'Sitzung abgelaufen',
		// 		en: 'Session expired',
		// 		es: 'Sesión expirada',
		// 		fr: 'Session expirée',
		// 		it: 'Sessione scaduta'
		// 	}
		// }),

		// emailAlreadyTaken: entry<{ email: string }>({
		// 	status: 'CONFLICT',
		// 	translations: {
		// 		de: 'E-Mail "{{email}}" wird bereits verwendet',
		// 		en: 'Email "{{email}}" is already taken',
		// 		es: 'El correo "{{email}}" ya está en uso',
		// 		fr: 'L\'email "{{email}}" est déjà utilisé',
		// 		it: 'L\'email "{{email}}" è già in uso'
		// 	}
		// }),

		// tooManyAttempts: entry<{ retryAfter: string }>({
		// 	status: 'TOO_MANY_REQUESTS',
		// 	translations: {
		// 		de: 'Zu viele Versuche. Erneut versuchen in {{retryAfter}}s',
		// 		en: 'Too many attempts. Retry after {{retryAfter}}s',
		// 		es: 'Demasiados intentos. Reintentar en {{retryAfter}}s',
		// 		fr: 'Trop de tentatives. Réessayer dans {{retryAfter}}s',
		// 		it: 'Troppi tentativi. Riprovare tra {{retryAfter}}s'
		// 	}
		// })
	}
});
