# Local Letter

Transactional email that speaks every language. Design a template once in a
visual editor, translate it per locale, and render it from any codebase with
one typed SDK call. Open source, self-hosted — your templates, your database,
your infrastructure.

## Monorepo layout

| Path                          | What it is                                                              |
|--------------------------------|--------------------------------------------------------------------------|
| [`apps/api`](apps/api)         | Express + Prisma + Postgres API. Auth (better-auth), projects, templates, rendering, API keys. |
| [`apps/web`](apps/web)         | The authenticated dashboard — React + Vite. Visual template editor (GrapesJS), projects, translations, API keys. |
| [`apps/site`](apps/site)       | The public marketing site — Next.js (App Router) + Tailwind v4.          |
| [`packages/node-sdk`](packages/node-sdk) | `local-letter` on npm — render a template and send it through Resend in one call. |
| [`packages/python-sdk`](packages/python-sdk) | `local-letter` on PyPI — the same SDK for Python.                       |
| [`examples/node`](examples/node) | A minimal Node script using the SDK end to end.                        |

## Requirements

- Node.js >= 20
- [pnpm](https://pnpm.io) 10.x (`corepack enable` will pick up the pinned version)
- A Postgres database

## Getting started

```bash
pnpm install
```

Each app reads its config from environment variables. Copy the example file
and fill it in for the apps you're running:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/site/.env.example apps/site/.env   # optional, only needed for the marketing site
```

`apps/api/.env` needs a real `DATABASE_URL` and a random `BETTER_AUTH_SECRET`.
See [apps/api/.env.example](apps/api/.env.example) for the full list.

Apply the database schema:

```bash
pnpm --filter @local-letter/api exec prisma migrate dev
```

Run everything in dev mode:

```bash
pnpm dev
```

This starts the API on `http://localhost:4000`, the dashboard on
`http://localhost:5173`, and the marketing site on `http://localhost:5174`
(via [Turborepo](https://turbo.build)). To run a single app, use
`pnpm --filter <name> dev` (e.g. `pnpm --filter @local-letter/web dev`).

Other root scripts — `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`
— fan out to every app the same way.

## Using the SDK

Once you have a project and an API key from the dashboard, render and send a
template from any Node backend:

```bash
npm install local-letter
```

```ts
import { TemplateClient } from "local-letter";

const letters = new TemplateClient({
  baseUrl: "https://letters.yourcompany.com",
  apiKey: process.env.LOCAL_LETTER_API_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  from: "hello@yourcompany.com",
});

await letters.send({
  template: "welcome-email",
  to: "customer@example.com",
  variables: { first_name: "Sagar" },
});
```

See [packages/node-sdk](packages/node-sdk) (or [packages/python-sdk](packages/python-sdk)
for Python) for the full SDK docs, and [examples/node](examples/node) for a
working example you can run.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

## License

MIT — see [LICENSE](LICENSE).
