# Changelog

## 0.4.0

132 original workplace-safe excuses: twelve distinct phrases in each of eleven categories. Seeded batches avoid repeats until all twelve phrases in the category have been used; larger batches cycle. Reports pair the joke with an honest next step. The jokes are for humor, not hiding incidents or misleading teammates.

```sh


## 0.3.0 — 2026-10-08

- Useful structured API/CLI additions described in README.
- TypeScript declarations, CommonJS entry, coverage gates and installed archive checks.
- Linux Node 22/24 plus Windows/macOS Node 24 CI.

## 0.2.0 — 2026-10-08

- Meeting preparation mode: Generate 1–20 excuses with `excuseBatch(category, { count, seed })`. A batch cycles through the category without repeats until its pool is exhausted. Seeds keep the starting point repeatable. CLI `--json` returns a string or array.
- Add npm and CI badges to the published README.

## 0.1.1 — 2026-10-08

- Correct npm installation and npx documentation after the initial publication.
- Add a searchable, humorous package description and relevant npm keywords.
- No API, CLI behavior, or dependency changes.

## 0.1.0 — 2026-10-08

- 33 original workplace-safe excuses across 11 categories.
- Library API, stateless seeded selection, and CLI with category listing.
- Tests, linting, formatting, and CI on Node 22/24.
```
