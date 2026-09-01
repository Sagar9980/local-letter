# local-letter examples

Runnable integrations against a live local-letter API. Each example is a real,
standalone app — not a test suite — so you can copy one wholesale into your own
project and change the credentials.

## Layout

One folder per language/runtime. Each is fully self-contained — its own
dependencies, its own lockfile, its own package manager — so nothing here
assumes Node, and `examples/` itself holds no build artefacts:

```
examples/
  node/       Node 20+ / Express      (local-letter)
  python/     (planned)
  go/         (planned)
```

Every example follows the same two-entry-point convention:

| Entry point    | What it is                                            | Use it to                                   |
| -------------- | ----------------------------------------------------- | ------------------------------------------- |
| `quickstart`   | A single script. No server, no framework, one send.    | Prove render + delivery work at all.        |
| `server`       | A real HTTP app with a signup endpoint that emails.    | See the shape you'd ship, and error mapping.|

...and the same environment contract, so credentials carry over between them:

| Variable                | Required | Default                  | Notes                                              |
| ----------------------- | -------- | ------------------------ | -------------------------------------------------- |
| `LOCAL_LETTER_BASE_URL` |          | `http://localhost:4000`  | Your API. No trailing slash.                        |
| `LOCAL_LETTER_API_KEY`  | yes      | —                        | Project API key from the dashboard's API Keys page. |
| `RESEND_API_KEY`        | yes      | —                        | Goes straight to Resend; local-letter never sees it.|
| `MAIL_FROM`             |          | `onboarding@resend.dev`  | Resend's shared sender, for testing without a domain.|
| `TEMPLATE_KEY`          |          | `welcome-email`          | Template key to render.                             |
| `TEST_TO`               | yes      | —                        | Recipient. See the sandbox note below.              |

## Prerequisites

Note that the SDK talks to **two** services: it renders against your local-letter
API, then hands the HTML to Resend itself. Both have to be reachable.

1. **The API is running.** `pnpm --filter @local-letter/api dev` (port 4000), with
   `DATABASE_URL` pointing at a migrated Postgres.
2. **A project with at least one template**, created in the dashboard.
3. **A project API key.** Dashboard → API Keys → create. The full key is shown
   once, at creation — copy it then.
4. **A Resend API key**, from resend.com.

### Sending without a verified domain

Resend's `onboarding@resend.dev` sender works with no domain setup, but it will
only deliver to the email address on your own Resend account. Set `TEST_TO` to
that address, or you'll get a 403 back from Resend. To mail anyone else, verify a
domain and set `MAIL_FROM` to an address on it.
