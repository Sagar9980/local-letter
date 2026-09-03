# Contributing

Thanks for taking a look at Local Letter. This is a young project, so please
open an issue before starting on anything non-trivial — it saves everyone a
rewritten PR.

## Getting set up

Follow [Getting started](README.md#getting-started) in the root README:
`pnpm install`, a Postgres database, `.env` files for `apps/api` and
`apps/web`, then `pnpm dev`.

You generally only need `apps/api` and `apps/web` running to work on the
product. `apps/site` (the marketing site) and `packages/sdk` are independent
and can be run on their own with `pnpm --filter <name> dev`.

## Before opening a PR

From the repo root:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

These run across every app via Turborepo. Fix anything that fails for a
package your change touches before requesting review.

There is no automated test suite yet — if you're adding one, say so in the PR
description so reviewers know what to expect.

## Making changes

- Keep changes scoped to the app(s) they touch. `apps/api`, `apps/web`,
  `apps/site`, and `packages/sdk` are independently versioned/deployed.
- If you change the API surface `packages/sdk` or `apps/web` depends on,
  update the caller in the same PR.
- Match the existing code style in the file/package you're editing rather
  than introducing a new one.
- Write commit messages that explain *why*, not just *what*.

## Pull requests

- Keep PRs focused — one logical change per PR.
- Describe what changed and why in the PR description; link the issue it
  addresses if there is one.
- A maintainer will review and may ask for changes before merging.

## Reporting bugs / requesting features

Open a [GitHub issue](https://github.com/Sagar9980/local-letter/issues) with
steps to reproduce (for bugs) or the use case (for features). For security
issues, see [SECURITY.md](SECURITY.md) instead of opening a public issue.
