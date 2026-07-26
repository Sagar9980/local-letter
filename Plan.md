# Email Template Platform — Project Plan

## 1. Overview

A self-hosted, open-source platform for designing multi-language email templates
per project, with a Node.js SDK that lets other codebases fetch a rendered
template (subject + HTML + text) by key, locale, and variables. The SDK does
**not** send email — the host application sends it using its own mailer.

Core pillars:
- **Dashboard** — visual drag-and-drop editor for designing templates, with
  per-locale variants.
- **Backend API** — stores projects/templates/locales, exposes a render
  endpoint secured by per-project API keys.
- **Node SDK** — thin, render-only client with caching and locale fallback.

---

## 2. Repository Structure

```
templates-platform/
├── apps/
│   ├── api/          → Node/Express backend
│   └── dashboard/     → React frontend (Vite)
├── packages/
│   └── sdk/           → Node SDK (published to npm independently)
└── docker-compose.yml
```

Monorepo (npm/pnpm workspaces) so API, dashboard, and SDK are versioned
together, while the SDK can still be published standalone to npm.

---

## 3. Architecture Diagram

```
┌─────────────┐      ┌──────────────┐      ┌───────────────┐
│  Dashboard  │─────▶│   Backend    │◀─────│  Node SDK      │
│   (React)   │      │  API + DB    │      │ (host apps)    │
└─────────────┘      └──────────────┘      └───────────────┘
                             │
                       ┌─────┴─────┐
                       │ Postgres  │
                       └───────────┘
```

---

## 4. Tech Stack

| Layer      | Choice                                             |
|------------|-----------------------------------------------------|
| Backend    | Node.js + Express                                   |
| Frontend   | React (Vite) + Tailwind                              |
| Editor     | GrapesJS + grapesjs-preset-newsletter (open source) |
| DB         | PostgreSQL + Prisma                                  |
| Auth       | JWT (dashboard users), API keys (SDK/project access) |
| Templating | Handlebars/Mustache for `{{variable}}` interpolation |
| Deployment | Docker Compose (self-hosted)                         |

**Editor rationale:** GrapesJS is MIT-licensed and fully self-hosted (unlike
Unlayer's visual editor, which calls external servers). The newsletter preset
produces table-based, inlined, email-client-safe HTML. Custom "variable"
blocks can be added so users drag in `{{tokens}}` visually.

---

## 5. Data Model

```
Project
  id, name, slug, api_key_hash

Template
  id, project_id, key, name, default_locale

TemplateLocale
  id, template_id, locale
  subject            -- may contain {{tokens}}
  html_body          -- compiled/exported HTML actually served
  design_json        -- raw GrapesJS project data (for re-editing)
  text_body          -- optional plain-text fallback
  variables_schema   -- [{ name, type, required, example }]
  status             -- draft | published

TemplateVersion
  -- snapshot of a TemplateLocale, for rollback/history

User
  id, email, password_hash, role   -- dashboard auth
```

Both `design_json` (to reload the visual editor) and `html_body` (the
compiled output served by the API) are stored, since GrapesJS needs its own
JSON structure separate from exported HTML.

---

## 6. API Routes (Draft)

**Dashboard auth (JWT):**
```
POST   /auth/login
POST   /projects
POST   /projects/:projectId/templates
POST   /templates/:id/locales
PUT    /locales/:id                 → save design_json + compiled html_body
GET    /locales/:id                 → reload editor state
```

**SDK-facing (API key auth):**
```
GET    /v1/templates/:key/locales   → list available locales
POST   /v1/render/:key              → { locale, variables } → { subject, html, text }
```

`POST /v1/render/:key` flow: fetch published `TemplateLocale` → validate
variables against `variables_schema` → interpolate `subject` and `html_body`
→ return `{ subject, html, text }`.

---

## 7. SDK Design (Render-Only)

```ts
import { TemplateClient } from "@yourorg/template-sdk";

const client = new TemplateClient({
  baseUrl: "https://templates.internal.company.com",
  apiKey: process.env.TEMPLATE_API_KEY,
});

const { subject, html, text } = await client.render("welcome_email", {
  locale: "fr",
  variables: { name: "Sarah", link: "https://..." },
  fallbackLocale: "en",
});

// caller sends however they want:
await myMailer.sendMail({ to, subject, html });
```

SDK internals:
- In-memory cache (TTL ~5 min) keyed by `templateKey:locale` — avoids a
  network round trip on every transactional send.
- Fallback to `default_locale`/`fallbackLocale` if requested locale isn't
  published.
- Clear, typed errors: validation error (missing required variable) vs.
  network/auth error.
- Zero dependency on any mail-sending library.

---

## 8. Auth Model

- **Dashboard**: JWT login, roles (admin/editor), scoped per project.
- **SDK/API**: one API key per Project (hashed in DB, shown once at
  creation), sent as `Authorization: Bearer <key>`. Read-only access to that
  project's **published** templates only.

---

## 9. Build Order (MVP → v1)

1. Express API: Projects, Templates, Locales CRUD + Postgres/Prisma schema.
2. `/v1/render/:key` endpoint + Handlebars interpolation + variable
   validation.
3. Node SDK: `render()` + cache + fallback locale — usable even before the
   visual editor exists (locales editable via simple form/API).
4. React dashboard: project/template management, GrapesJS newsletter editor
   embedded, locale tabs, live preview with sample variables, draft/publish
   toggle.
5. API key management UI + test-send preview (SMTP config for previewing
   only, not part of SDK).
6. Versioning/rollback.
7. Polish: audit logs, template duplication across locales, webhooks.

---

## 10. Open Decisions for Later

- Deployment target: Docker Compose only, or also Kubernetes/Helm chart?
- Multi-user roles: per-project permissions, or org-wide admin only?
- Variable schema format: freeform JSON vs. a fixed typed spec (string,
  number, boolean, url, date)?
- Whether to support plain-text auto-generation from HTML (strip tags) as a
  fallback if `text_body` isn't authored.

---

## 11. Naming Candidates

Shortlist under consideration (pending npm/GitHub availability check):
1. **Missive**
2. **Templix**
3. **Localetter**

Other candidates: Postbox Studio, Templateer, Mailcraft, Envoy, Scribe,
Ledger, TemplateForge, MailForge, Notifyr, Templatr.

---

## 12. Current Work: API Keys UI + Resend-Sending SDK

**Scope note (deviation from §7/§8):** the SDK was originally spec'd as
render-only ("Zero dependency on any mail-sending library"). Per updated
direction, the SDK will now also **send** the email itself via Resend, so
host apps only need to call one function. Sections 7/8 below are superseded
for this iteration; update them once this ships.

### Branch
1. Create feature branch `feat/api-keys-and-sdk` off `main` before starting
   any of the work below.

### Step 2 — API Keys dashboard section

Backend (`apps/api/src/index.ts`, `requireSession`-gated, scoped to a
project the caller owns via existing `getOwnedProject`):
- `GET  /projects/:slug/api-keys` — list keys for the project (id, name,
  `start`/`prefix` for display, enabled, createdAt, lastRequest — never the
  raw `key`).
- `POST /projects/:slug/api-keys` — create via `auth.api.createApiKey({ body: { name, referenceId: user.id, metadata: { projectId } } })`, then
  `prisma.apiKey.update` to stamp our own `projectId` column (the plugin
  doesn't know about it). Returns the **raw key once** — client must show/copy
  it immediately, it's not retrievable again.
- `DELETE /projects/:slug/api-keys/:id` — revoke (`auth.api.deleteApiKey` or
  `enabled: false` update), scoped to project ownership.
- Update `requireApiKey` middleware (`apps/api/src/middleware/auth.ts`) to
  also attach `req.apiKeyProjectId` from `result.key.projectId`, so
  SDK-facing routes can scope queries to that one project without trusting
  client input.

Frontend:
- New page `apps/web/src/pages/ApiKeysPage.tsx` at route
  `/projects/:slug/api-keys` (flip `ProjectSidebar`'s "API Keys" nav item
  from `disabled: true` to enabled, pointing at `segment: "api-keys"`).
- Table of existing keys (name, prefix like `sk_live_ab12***`, created,
  last used, revoke button with confirm).
- "Create key" dialog: name input → on success, show the raw key **once**
  in a copy-to-clipboard box with a "you won't see this again" warning.

### Step 3 — Node SDK (`packages/sdk`)

Backend — new SDK-facing render endpoint (`requireApiKey`-gated, per §6):
- `POST /v1/render/:key` — body `{ variables, locale?, fallbackLocale? }`.
  Looks up the template by key **scoped to `req.apiKeyProjectId`** (not an
  arbitrary project), picks the requested locale's published
  `TemplateLocale` (fallback to `template.defaultLocale`/`fallbackLocale`
  if requested locale missing or not published), does a simple
  `{{variable}}` string replacement over `subject`/`htmlBody`, and returns
  `{ subject, html }`. 404 if template not found in that project, 409/400
  if no published locale available.

SDK (`packages/sdk/src/index.ts`), depends on `resend` as a dependency:
```ts
import { Resend } from "resend";

new TemplateClient({
  baseUrl: "https://your-local-letter-instance",
  apiKey: process.env.LOCAL_LETTER_API_KEY,   // project API key from step 2
  resendApiKey: process.env.RESEND_API_KEY,
  from: "you@yourdomain.com",
});

await client.send({
  template: "welcome-email",
  to: "user@example.com",
  variables: { first_name: "Sarah", link: "https://..." },
  locale: "en", // optional
});
```
- `send()` internally: POST to `/v1/render/:key` with `variables`/`locale`
  → gets back `{ subject, html }` → calls `resend.emails.send({ from, to,
  subject, html })` → returns Resend's `{ id }`.
- Typed errors: template-not-found / not-published (from our API) vs.
  Resend send failure, kept distinguishable so the host app can handle
  each differently.
- No in-memory render cache for v1 (can add later) — keep the first cut
  simple and correct.
- `resend` and `@types/node` as the only dependencies; `resend` is a
  peerDependency-or-direct dep decision to make when implementing (direct
  dep is simpler since the SDK's whole job now includes sending).

### Open questions to confirm before/while implementing
- Does the render endpoint require the locale to be `published`, or is
  `draft` sendable too (useful for testing)? Default assumption: allow
  sending drafts (no `published` gate) unless told otherwise, since there's
  no separate "test send" flow yet.
- One Resend API key per host app (env var), not stored in our DB — SDK
  talks to Resend directly, our backend never sees the Resend key. Confirms
  no secret-handling burden added to the platform itself.
