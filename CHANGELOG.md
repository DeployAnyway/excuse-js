# Changelog

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
