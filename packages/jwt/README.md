# 🔐 DWS JWT

Signing and verifying JWTs shouldn't require boilerplate.  
`@dws-std/jwt` wraps [jose](https://github.com/panva/jose) with sane defaults — HS256, standard claims pre-filled, human-readable expiration - so you can focus on what matters instead of re-reading the JWT spec.

## 📌 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
    - [signJWT](#signjwt)
    - [verifyJWT](#verifyjwt)
- [Error handling](#-error-handling)
- [License](#-license)

## 🔧 Installation

```bash
bun add @dws-std/jwt
```

## ⚙️ Usage

### `signJWT`

Signs a payload and returns a JWT string.  
All standard claims (`iss`, `sub`, `aud`, `jti`, `nbf`, `iat`, `exp`) are included automatically - just pass your custom data and let the function handle the rest.

```ts
import { signJWT } from '@dws-std/jwt';

// Default expiration: 15 minutes
const token = await signJWT(secret, { userId: 42, role: 'admin' });

// Numeric offset in seconds
const token = await signJWT(secret, { userId: 42 }, 3600);

// Date object
const token = await signJWT(secret, { userId: 42 }, new Date(Date.now() + 3600_000));

// Human-readable — powered by @dws-std/common
const token = await signJWT(secret, { userId: 42 }, '1 hour');
const token = await signJWT(secret, { userId: 42 }, '30 minutes');
const token = await signJWT(secret, { userId: 42 }, '7 days');
```

The secret must be at least 32 characters long (HS256 requirement). Any shorter and it throws immediately — better to catch it at startup than in production.

Default claims can be overridden by providing them in the payload:

```ts
const token = await signJWT(secret, {
	iss: 'my-service',
	sub: 'user-123',
	aud: ['my-api'],
	userId: 42
});
```

### `verifyJWT`

Verifies a token and returns the decoded payload. Throws if anything is wrong.

```ts
import { verifyJWT } from '@dws-std/jwt';

const { payload } = await verifyJWT(token, secret);
console.log(payload.userId);
```

Optionally validate `iss` and `aud` claims:

```ts
const { payload } = await verifyJWT(token, secret, {
	issuer: 'my-service',
	audience: 'my-api'
});
```

## 🚨 Error handling

All errors are `Exception` instances from `@dws-std/error` with a `key` you can check:

| Key                     | When                                                            |
| ----------------------- | --------------------------------------------------------------- |
| `jwt.secret_too_weak`   | Secret is shorter than 32 characters                            |
| `jwt.expiration_passed` | Expiration is in the past or equals now                         |
| `jwt.sign_error`        | jose failed to sign the token                                   |
| `jwt.token_expired`     | Token is valid but past its expiry date                         |
| `jwt.unauthorized`      | Invalid signature, malformed token, or claim validation failure |

```ts
import { Exception } from '@dws-std/error';
import { JWT_ERROR_KEYS, verifyJWT } from '@dws-std/jwt';

try {
	const { payload } = await verifyJWT(token, secret);
} catch (error) {
	if (error instanceof Exception) {
		if (error.key === JWT_ERROR_KEYS.JWT_EXPIRED) {
			// Token expired — trigger a refresh
		}
		// Everything else is unauthorized
	}
}
```

## ⚖️ License

MIT - Feel free to use it.
