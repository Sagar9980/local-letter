# Go example

Uses the Go SDK from a plain Go app. Its `go.mod` has a `replace` pointing at
`../../packages/go-sdk`, so it runs against the SDK's actual source — if an
exported name or the package layout is wrong, this example is where you'll
find out.

## Setup

```bash
cd examples/go
go mod download

cp .env.example .env           # then fill in the two API keys and TEST_TO
```

Requires Go 1.23+. Both entry points read `.env` from the directory you run
them in, which is why the commands below are run from `examples/go`. Real
environment variables win over `.env`.

## 1. Quickstart — one send, no server

```bash
go run ./cmd/quickstart
go run ./cmd/quickstart someone@example.com
```

Renders `TEMPLATE_KEY` and sends it, then prints the Resend message id, the
locale that won, and the rendered subject. The fastest way to tell whether
the whole chain is wired up.

## 2. Server — the shape you'd actually ship

```bash
go run ./cmd/server
```

| Route               | Body                                           | Does                                       |
| ------------------- | ----------------------------------------------- | ------------------------------------------- |
| `GET  /health`      | —                                                | Echoes the resolved config.                 |
| `POST /signup`      | `{ email, name }`                                | Sends the welcome template to a new user.   |
| `POST /emails/send` | `{ template, to, variables, locale, replyTo }`   | Renders and sends any template.             |

```bash
curl -X POST localhost:3001/signup \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","name":"Sagar"}'
```

`/signup` passes the request's `Accept-Language` through as the locale with
an `en` fallback, which is the multi-locale path worth exercising.

Each handler passes `r.Context()` into `Send`, so a client that hangs up
cancels the render and the Resend call with it.

## Errors you should expect to hit

| Symptom                                                   | Cause                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| `Render failed (HTTP 401): Invalid API key`                | `LOCAL_LETTER_API_KEY` is wrong, or was never created.        |
| `Render failed (HTTP 404): Template not found`             | No template with that key in the key's project.               |
| `Render failed (HTTP 403)`                                 | The API key isn't linked to a project.                        |
| `Send failed: ... testing emails ...`                      | Using `onboarding@resend.dev` to mail anyone but yourself.    |
| `Unexpected error: ...connection refused`                  | The API isn't running at `LOCAL_LETTER_BASE_URL`.              |
| `Send failed: ... subject ...`                             | The template's subject is blank in the dashboard.              |
| `missing required env vars: ...`                           | `.env` wasn't filled in, or you ran from the wrong directory.  |
