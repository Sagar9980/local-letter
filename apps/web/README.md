# @local-letter/web

The authenticated dashboard for Local Letter — where you create projects,
design templates, translate them per locale, and manage API keys. Separate
from `apps/site`, which is the public marketing site.

React + Vite + Tailwind v4, talking to `apps/api` over HTTP (session cookies
for the dashboard itself, project API keys for the SDK-facing endpoints). The
template editor is built on [GrapesJS](https://grapesjs.com) with the
newsletter preset.

## Development

```bash
cp .env.example .env   # set VITE_API_URL to your running apps/api instance
pnpm dev                # http://localhost:5173
```

Requires `apps/api` running (see the [root README](../../README.md)) — the
dashboard has no backend of its own.

## Scripts

```bash
pnpm dev          # start the Vite dev server
pnpm build         # typecheck (tsc -b) and build for production
pnpm typecheck     # tsc -b --noEmit
pnpm lint          # oxlint
pnpm preview       # preview the production build locally
```

## Structure

```
src/
  components/
    auth/        # login/signup forms
    brand/       # logo, marks
    dashboard/   # shell, nav, project/template UI
    ui/          # shadcn-generated primitives
  hooks/
  lib/           # API client, auth client, utilities
  pages/         # route-level views (projects, templates, editor, API keys)
  routes/        # router setup
  types/
```
