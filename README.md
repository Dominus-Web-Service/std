# DWS Standard Library

The shared TypeScript toolkit behind **Dominus Web Services**.
Everything lives in this monorepo, is built with [Bun](https://bun.sh/), and published on npm under the `@dws-std/` scope.

## Packages

| Package                                  | What it does                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`@dws-std/common`](packages/common)     | Common utilities and types for Dominus Web Services (DWS) projects.                             |
| [`@dws-std/error`](packages/error)       | Structured exceptions with UUID v7 tracking and HTTP status codes.                              |
| [`@dws-std/i18n`](packages/i18n)         | Type-safe internationalization — localized messages and exceptions with template interpolation. |
| [`@dws-std/jwt`](packages/jwt)           | Simplified JWT handling with sane defaults, human-readable expiration, and standard claims.     |
| [`@dws-std/registry`](packages/registry) | A centralized, type-safe registry for managing named instances.                                 |
| [`@dws-std/totp`](packages/totp)         | Time-based One-Time Password (TOTP) implementation in TypeScript.                               |

## Getting Started

```bash
bun install
```

## Scripts

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `bun run build`    | Build all packages                          |
| `bun run test`     | Run every test suite                        |
| `bun run lint`     | Lint all packages                           |
| `bun run lint:fix` | Lint and auto-fix                           |
| `bun run docs`     | Generate TypeDoc documentation              |
| `bun run clean`    | Wipe `node_modules`, `dist`, and lock files |

## Project Structure

```
packages/
├── common/              # @dws-std/common
├── error/               # @dws-std/error
├── i18n/                # @dws-std/i18n
├── jwt/                 # @dws-std/jwt
├── registry/            # @dws-std/registry
└── totp/                # @dws-std/totp
```

## Documentation

[Dominus-Web-Service.github.io/packages](https://Dominus-Web-Service.github.io/packages/)

## License

MIT - [Dominus Web Services (DWS)](https://github.com/Dominus-Web-Service)
