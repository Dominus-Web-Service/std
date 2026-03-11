# 🐞 DWS Error

Handling errors in TypeScript is usually a mess of `Error` objects without context.  
DWS Error standardizes how errors are tracked and exposed in APIs, ensuring every crash is traceable and safe for production.

## Why this package?

The goal is simple: **Stop exposing server internals to clients.**

This package forces a clear distinction between what the user sees (`HttpError`) and what your logs see (`InternalError`),
while automatically tagging everything with UUID v7 for instant log correlation.

## 📌 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

- 🔍 **UUID v7 Tracking**: Every error gets a unique, time-sortable ID automatically.
- 🔒 **Security-First**: Native separation between client-safe messages and sensitive internal logs.
- 📅 **Built-in Context**: Timestamps and HTTP status codes are part of the instance.
- 📦 **Zero Dependencies**: Pure TypeScript, tiny footprint.

## 🔧 Installation

```bash
bun add @dws-std/error
```

## ⚙️ Usage

### HttpError - Client-Facing Errors

Use this when you want to tell the user _why_ they failed (e.g., 400 Bad Request).

```ts
import { HttpError } from '@dws-std/error';

throw new HttpError('Invalid email address', 'BAD_REQUEST', { field: 'email' });
```

### InternalError - Server-Side Errors

Use this to wrap unexpected failures (DB crashes, API timeouts). Log the full `cause` server-side, but only send the `uuid` to the client.

```ts
import { InternalError } from '@dws-std/error';

try {
	await db.save(user);
} catch (err) {
	// The original 'err' is hidden from the client but kept in 'cause'
	throw new InternalError('Failed to persist user', err);
}
```

## 📚 API Reference

Full docs: [Dominus-Web-Service.github.io/packages](https://Dominus-Web-Service.github.io/packages/)

## ⚖️ License

MIT - Feel free to use it.

## 📧 Contact

- GitHub: [Dominus-Web-Service](https://github.com/Dominus-Web-Service/packages)
