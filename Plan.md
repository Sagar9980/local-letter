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
