# Node / Express example

Uses `@local-letter/sdk` from a plain Node app. Installed via
`file:../../packages/sdk`, so it consumes the package's built `dist/` the same
way an npm install would — if the build output or entry points are wrong, this
example is where you'll find out.

## Setup

```bash
# from the repo root, build the SDK first
pnpm --filter @local-letter/sdk build

cd examples/node
cp .env.example .env   # then fill in the two API keys and TEST_TO
pnpm install
```

Everything installs into `examples/node/` and nothing leaks upward. The empty
`pnpm-workspace.yaml` in this folder is what makes that true: without it pnpm
walks up, finds the repo's own workspace root, and reinstalls the whole monorepo
instead. Each example owns its dependencies and its package manager — `examples/`
itself stays neutral.

## 1. Quickstart — one send, no server

```bash
node quickstart.js
node quickstart.js someone@example.com
```

Renders `TEMPLATE_KEY` and sends it, then prints the Resend message id, the
locale that won, and the rendered subject. The fastest way to tell whether the
whole chain is wired up.

## 2. Server — the shape you'd actually ship

```bash
node server.js
```

| Route               | Body                                        | Does                                     |
| ------------------- | ------------------------------------------- | ---------------------------------------- |
| `GET  /health`      | —                                           | Echoes the resolved config.               |
| `POST /signup`      | `{ email, name }`                           | Sends the welcome template to a new user. |
| `POST /emails/send` | `{ template, to, variables, locale, replyTo }` | Renders and sends any template.        |

```bash
curl -X POST localhost:3000/signup \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","name":"Sagar"}'
```

`/signup` passes the request's `Accept-Language` through as the locale with an
`en` fallback, which is the multi-locale path worth exercising.

## Errors you should expect to hit

| Symptom                                  | Cause                                                        |
| ---------------------------------------- | ------------------------------------------------------------ |
| `Render failed (HTTP 401): Invalid API key` | `LOCAL_LETTER_API_KEY` is wrong, or was never created.     |
| `Render failed (HTTP 404): Template not found` | No template with that `key` in the key's project.       |
| `Render failed (HTTP 403)`               | The API key isn't linked to a project.                        |
| `Send failed: ... testing emails ...`    | Using `onboarding@resend.dev` to mail anyone but yourself.    |
| `Unexpected error: fetch failed`         | The API isn't running at `LOCAL_LETTER_BASE_URL`.             |
| `Send failed: ... subject ...`           | The template's subject is blank in the dashboard.             |
