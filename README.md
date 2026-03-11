# DWS Packages

Monorepo for **Dominus Web Services** shared TypeScript packages.
Built with [Bun](https://bun.sh/), published on npm under the `@dws-std/` scope.

## Packages

| Package | Description |
|---------|-------------|
| [`@dws-std/error`](packages/error) | Structured error hierarchy with UUID v7 tracking, HTTP status codes, and client/server separation. |
| [`@dws-std/singleton-manager`](packages/singleton-manager) | Centralized type-safe registry for managing singleton instances by name. |

## Getting Started

```bash
bun install
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build all packages |
| `bun run test` | Run all test suites |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Lint and auto-fix |
| `bun run docs` | Generate TypeDoc documentation |
| `bun run clean` | Remove all `node_modules` and `bun.lock` files |

## Project Structure

```
packages/
├── error/               # @dws/error
├── singleton-manager/   # @dws/singleton-manager
└── template/            # Package scaffold template
```

## Documentation

[Dominus-Web-Service.github.io/packages](https://Dominus-Web-Service.github.io/packages/)

## License

MIT — [Dominus Web Services (DWS)](https://github.com/Dominus-Web-Service)
