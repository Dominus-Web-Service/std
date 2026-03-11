# 🎯 DWS - Singleton Manager

Managing singletons in TypeScript shouldn't require boilerplate everywhere. I built this package to have a single, centralized registry for all my singleton instances, no more scattered `getInstance()` patterns or global variables.

## Why this package?

The goal is simple: **One registry to rule them all.**

Instead of implementing the singleton pattern in every class, you register instances once and retrieve them anywhere. Type-safe, predictable, and easy to test.

## 📌 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

- 🔒 **Type-Safe**: Full TypeScript support with generics, no `any` casting.
- 🎯 **Centralized**: One place to manage all your singletons.
- ⚡ **Lightweight**: Minimal overhead, zero dependencies.

## 🔧 Installation

```bash
bun add @dws-std/singleton-manager @dws-std/error
```

## ⚙️ Usage

### Registering Singletons

Register your instances once at startup. They'll be available everywhere.

```typescript
import { SingletonManager } from '@dws-std/singleton-manager';

class DatabaseConnection {
	private _isConnected = false;

	public constructor() {
		console.log('Database connection created');
		this._isConnected = true;
	}

	public query(sql: string): string[] {
		return ['result1', 'result2'];
	}
}

class ApiClient {
	public constructor(
		private readonly _baseUrl: string,
		private readonly _apiKey: string
	) {}

	public get baseUrl(): string {
		return this._baseUrl;
	}
}

// Register with any constructor signature
SingletonManager.register('DatabaseConnection', new DatabaseConnection());
SingletonManager.register('ApiClient', new ApiClient('https://api.example.com', 'key'));
```

### Retrieving Instances

Same instance, every time. TypeScript knows the type.

```typescript
const db1 = SingletonManager.get<DatabaseConnection>('DatabaseConnection');
const db2 = SingletonManager.get<DatabaseConnection>('DatabaseConnection');

console.log(db1 === db2); // true — same reference

db1.query('SELECT * FROM users'); // ✅ Type-safe
```

### Checking & Unregistering

```typescript
if (SingletonManager.has('ApiClient')) {
	const client = SingletonManager.get<ApiClient>('ApiClient');
	console.log(client.baseUrl);
}

// Need to swap an instance? Unregister first.
SingletonManager.unregister('DatabaseConnection');
SingletonManager.register('DatabaseConnection', new DatabaseConnection());
```

## 📚 API Reference

Full docs: [Dominus-Web-Service.github.io/packages](https://Dominus-Web-Service.github.io/packages/)

## ⚖️ License

MIT - Feel free to use it.

## 📧 Contact

- GitHub: [Dominus-Web-Service](https://github.com/Dominus-Web-Service/packages)
