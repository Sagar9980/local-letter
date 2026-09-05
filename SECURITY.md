# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, email **sagardhami2001@gmail.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce it (a minimal repro is very helpful)
- The affected app/package (`apps/api`, `apps/web`, `apps/site`, or
  `packages/node-sdk`) and version/commit if known

You should get an acknowledgement within a few days. Once a fix is ready,
we'll coordinate with you on disclosure timing and credit if you'd like it.

## Scope

Local Letter is self-hosted: you run `apps/api` and its Postgres database
yourself, and API keys/session secrets are yours to manage. Reports about
`apps/api` (auth, API key handling, template rendering, tenant isolation
between projects) and `packages/node-sdk` (how it talks to your API and to Resend)
are especially useful, since those are the parts that handle credentials and
user data.

Issues in third-party dependencies should generally be reported upstream, but
feel free to flag them here too if you're not sure.
