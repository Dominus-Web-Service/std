# 🧰 DWS Common

Small utilities you'll want everywhere, but don't belong to any specific domain.  
Instead of copy-pasting the same helpers across every project, `@dws-std/common` collects them in one place so you can just import and move on.

## 📌 Table of Contents

- [Installation](#-installation)
- [Utilities](#-utilities)
    - [parseHumanTimeToSeconds](#parsehumentimetoseconds)
- [License](#-license)

## 🔧 Installation

```bash
bun add @dws-std/common
```

## 🛠️ Utilities

### `parseHumanTimeToSeconds`

Converts a human-readable time expression into a number of seconds.  
Useful anywhere you need to define durations without sprinkling magic numbers - JWT expiry, TTLs, rate-limit windows, you name it.

```ts
import { parseHumanTimeToSeconds } from '@dws-std/common';

parseHumanTimeToSeconds('2 hours'); // 7200
parseHumanTimeToSeconds('30 mins'); // 1800
parseHumanTimeToSeconds('1 day'); // 86400
parseHumanTimeToSeconds('2 weeks'); // 1209600
parseHumanTimeToSeconds('1 year'); // 31557600
```

Past and future offsets are also supported:

```ts
parseHumanTimeToSeconds('30 mins ago'); // -1800
parseHumanTimeToSeconds('+1 day'); // 86400
parseHumanTimeToSeconds('-2 hours'); // -7200
parseHumanTimeToSeconds('1 hour from now'); // 3600
```

**Supported units:**

| Unit   | Accepted aliases                        |
| ------ | --------------------------------------- |
| Second | `s`, `sec`, `secs`, `second`, `seconds` |
| Minute | `m`, `min`, `mins`, `minute`, `minutes` |
| Hour   | `h`, `hr`, `hrs`, `hour`, `hours`       |
| Day    | `d`, `day`, `days`                      |
| Week   | `w`, `week`, `weeks`                    |
| Year   | `y`, `yr`, `yrs`, `year`, `years`       |

Throws an `Exception` if the expression is invalid or the unit is unrecognised.


## 📚 API Reference

Full docs: [Dominus-Web-Service.github.io/packages](https://Dominus-Web-Service.github.io/packages/)

## ⚖️ License

MIT - Feel free to use it.

## 📧 Contact

- GitHub: [Dominus-Web-Service](https://github.com/Dominus-Web-Service/packages)
