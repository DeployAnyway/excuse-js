# Contributing

Welcome! Keep jokes original, workplace-safe, and about technology rather than people.

Use Node 22.13+ or 24. Create a feature branch, run `npm ci`, and add phrases
to `src/excuses.js`. Categories must be lowercase and contain nonempty strings.
Keep at least three phrases per category. Add tests when changing behavior.

Before submitting a PR, run:

```sh
npm run format
npm run lint
npm run format:check
npm test
npm pack --dry-run
```

Describe changes and validation. Changing phrase order or count can change seeded
output; mention it in the changelog. Discuss public API changes in an issue first.
