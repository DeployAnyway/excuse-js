# excuse-js

> **0.3.0 release candidate:** this branch is not published. npm still serves 0.2.0. New options below require a source checkout or locally packed candidate.

[![npm version](https://img.shields.io/npm/v/%40deployanyway%2Fexcuse-js)](https://www.npmjs.com/package/@deployanyway/excuse-js)
[![CI](https://github.com/DeployAnyway/excuse-js/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/DeployAnyway/excuse-js/actions/workflows/ci.yml)

A seeded developer excuse generator for bugs, builds, and deployments. Finally, a dependency that takes the blame.

```text
The edge case moved to the center and brought furniture.
```

## Installation

Available on npm. Requires Node 22 or later.
You can also run from source with Node 22 or 24:

```sh
git clone https://github.com/DeployAnyway/excuse-js.git
cd excuse-js
git checkout main
npm ci
node bin/cli.js bug
```

Install from npm: `npm install @deployanyway/excuse-js`.

## Quick start

```js
import { excuse, categories } from "@deployanyway/excuse-js";

console.log(excuse("deployment"));
console.log(excuse("bug", { seed: "demo" }));
console.log(categories());
```

## CLI example

```sh
node bin/cli.js deployment --seed demo
```

Run with npx: `npx @deployanyway/excuse-js deployment --seed demo`.

## API and options

`excuse(category = 'deployment', { seed } = {})` returns a string. Category names
are trimmed and case insensitive. Unknown categories throw RangeError. Invalid
categories, options, and seeds throw TypeError. The library never exits or logs.

`seed` accepts a string (including empty string) or a finite number (including zero).
Without a seed, selection uses Math.random. With a seed, selection uses FNV-1a
over the UTF-16 code units of `category:type:seed`, then takes the unsigned hash
modulo the phrase count. String and numeric seeds are distinct. Calls have no
shared seed state; the same inputs select the same phrase within this version.
Different seeds can select the same phrase. Seeded output can change when the
catalog changes between versions; this is not a cryptographic generator.

`categories()` returns a fresh array of available lowercase names.

## Categories

deployment, build, production, bug, api, database, deadline, testing, network,
merge-conflict, demo. Each starts with three original, workplace-safe phrases.

Custom runtime categories are deferred. Contributors can extend the data file
without changing the selection logic.

## CLI reference

`excuse-js [category] [options]`

| Option            | Behavior                                                   |
| ----------------- | ---------------------------------------------------------- |
| `--seed text`     | Deterministic selection; CLI seeds are always strings      |
| `--list`          | Print category names; cannot combine with category or seed |
| `--help`, `-h`    | Show help                                                  |
| `--version`, `-v` | Show version                                               |

No category defaults to deployment. Quote seeds containing spaces. Exit code 0
means success; 2 means invalid arguments. No stdin support in this MVP.

## Examples and development

```sh
npm ci
node examples/basic.js
npm run lint
npm run format:check
npm test
npm pack --dry-run
```

ES modules, Node's built-in test runner, zero production dependencies. CI runs
Node 22/24. ESLint development requires Node 22.13+ or 24. Phrases are in
`src/excuses.js`, API in `src/index.js`, and CLI in `bin/cli.js`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Useful first, funny second.

## License

[MIT](LICENSE).

## More from DeployAnyway

**Tools for developers who probably know better.**

- [error-translator](https://github.com/DeployAnyway/error-translator)
- [excuse-js](https://github.com/DeployAnyway/excuse-js)
- [doggo-log](https://github.com/DeployAnyway/doggo-log)
- [ship-it-meter](https://github.com/DeployAnyway/ship-it-meter)
- [bro-say](https://github.com/DeployAnyway/bro-say)

## Meeting preparation mode

Generate 1–20 excuses with `excuseBatch(category, { count, seed })`. A batch cycles through the category without repeats until its pool is exhausted. Seeds keep the starting point repeatable. CLI `--json` returns a string or array.

```sh
npx @deployanyway/excuse-js deployment --count 3 --seed demo
```

API (import the named functions from this package):

```js
excuseBatch("deployment", { count: 3, seed: "demo" });
```

## Jokes with a useful exit strategy

```js
import { excuseReport } from "@deployanyway/excuse-js";
const report = excuseReport("testing", { seed: 42 });
console.log(report.excuse);
console.log(report.nextStep);
```

The structured report pairs the original comic excuse with a category-specific, honest next step. It does not invent evidence or recommend lying. Seeds are stateless and version-specific; numeric 42 differs from the CLI's string seed "42".

```sh
node bin/cli.js testing --report --seed demo
node bin/cli.js deployment --report --json
```

--report cannot be combined with --count or --list. Existing string and batch JSON output stays available. No stdin is needed: this generator has no external input payload. Do not use jokes as incident reports.

## Candidate quality standard

The 0.3 candidate provides useful declaration types, ESM/CommonJS exports, installed-archive checks, and coverage gates (90% statements/lines/functions, 85% branches). CI covers Linux Node 22/24 and Windows/macOS Node 24. Node 22.13+ is required. No runtime dependencies, telemetry or network requests.

From a candidate checkout: npm ci, npm run build, npm run coverage, npm run test:types, npm run verify:package. Pack verification installs a temporary local archive and checks module entries, types, executable and offline npm exec.

[Contribution guide](CONTRIBUTING.md) · [Conduct](CODE_OF_CONDUCT.md) · [Security](SECURITY.md) · [Roadmap](ROADMAP.md) · [Migration](MIGRATION.md).

**Tools for developers who probably know better.** Software nobody requested, built with questionable priorities, and shipped with absolute confidence!
