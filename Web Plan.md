# Auth + Dashboard for apps/web

## Context

Better Auth was just wired up on the API side (`apps/api/src/auth.ts`, `middleware/auth.ts`, Prisma schema) but `apps/web` is still the untouched Vite scaffold — no router, no auth client, no UI kit, no pages. This task builds the missing frontend half: login/signup, session-gated routing, a dashboard shell, and a Projects page (the one domain object that already exists in the schema), plus the small API-side additions needed to support it (CORS, project ownership, project CRUD routes).

User-confirmed decisions: use **shadcn/ui** for components, scope is **auth + dashboard shell + Projects page only** (no Templates/API Keys UI yet), and add **`cors` middleware** to the API for credentialed cross-origin requests.

## Ordering

1. Prisma schema (Project ownership) + migration
2. API: CORS
3. API: Projects REST routes
4. Web: scaffolding (router, auth client, shadcn, aliases, env)
5. Web: auth pages + route guards
6. Web: dashboard shell
7. Web: Projects page
8. Manual verification

---

## 1. Prisma schema — user↔project ownership

`apps/api/prisma/schema.prisma` currently has no link between `User` and `Project`. Add a single-owner FK (simplest option; a join table can be introduced later non-destructively if multi-user projects are ever needed):

- `User`: add `projects Project[]`
- `Project`: add `ownerId String`, `owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)`, `@@index([ownerId])`
- Keep `slug` globally unique as-is.

Run `pnpm exec prisma migrate dev --name add_project_owner` from `apps/api` (first migration in the repo — creates `apps/api/prisma/migrations/...`). If local dev data already has Projects without an owner, clear it first since `ownerId` is non-null.

## 2. API: CORS

Add `cors` + `@types/cors` (dev) to `apps/api/package.json`. In `apps/api/src/index.ts`, mount **before** the existing `app.all("/api/auth/*", toNodeHandler(auth))` line (auth endpoints are called cross-origin too, and `cors` only touches headers/OPTIONS — it doesn't consume the body, so it's safe ahead of Better Auth's own parsing):

```
app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:5173", credentials: true }));
```

No new env var — reuses existing `WEB_ORIGIN`.

## 3. API: Projects routes

In `apps/api/src/index.ts`, after `express.json()`, add (both behind `requireSession`, importing `prisma` from `./db`):

- `GET /projects` — `prisma.project.findMany({ where: { ownerId: req.user!.id }, orderBy: { createdAt: "desc" } })`
- `POST /projects` — body `{ name, slug? }`; derive slug from name if omitted (lowercase, non-alphanumeric → `-`, trim/collapse dashes); validate `name` non-empty (400) and slug matches `^[a-z0-9-]+$` (400); create scoped to `ownerId: req.user!.id`; catch Prisma P2002 (unique slug) → 409.

No validation library exists in this repo yet — keep checks manual, matching current style.

## 4. Web: scaffolding

Add to `apps/web/package.json`: `react-router-dom` (^7), `better-auth` (match API's `^1.6.23` — client comes from `better-auth/react` in the same package).

shadcn/ui: run `pnpm dlx shadcn@latest init` from `apps/web` (Tailwind v4 compatible), then `pnpm dlx shadcn@latest add button input card table dialog dropdown-menu avatar label separator`. This generates `apps/web/components.json`, `apps/web/src/lib/utils.ts`, updates `apps/web/src/index.css` with `@theme` tokens, and adds `apps/web/src/components/ui/*.tsx`.

Path alias needed for shadcn: add `@/*` → `./src/*` in `apps/web/tsconfig.app.json` (`baseUrl`/`paths`) and a matching `resolve.alias` in `apps/web/vite.config.ts`.

New files:
- `apps/web/src/lib/auth-client.ts` — `createAuthClient` from `better-auth/react`, `baseURL: import.meta.env.VITE_API_URL`, `fetchOptions: { credentials: "include" }`; export `signIn`, `signUp`, `signOut`, `useSession`.
- `apps/web/src/lib/api.ts` — thin `apiFetch(path, init)` wrapper prefixing `VITE_API_URL`, always `credentials: "include"`, JSON content-type when body present, throws parsed `{ error }` on non-2xx. Used for `/projects` (plain REST, not under `/api/auth/*`).
- `apps/web/src/lib/slugify.ts` — shared slug helper (dialog preview + any future reuse).
- `apps/web/.env.example` — `VITE_API_URL="http://localhost:4000"`

## 5. Web: auth pages + guards

Replace `apps/web/src/App.tsx`'s content to host a `createBrowserRouter` (keep `main.tsx` unchanged):
- `/login` → `LoginPage`, `/signup` → `SignupPage` (both wrapped in `RedirectIfAuthed`)
- `/dashboard` → `DashboardLayout` (wrapped in `RequireAuth`), nested index redirects to `/dashboard/projects`, which renders `ProjectsPage`
- `/` → redirect based on session state

New files:
- `apps/web/src/routes/RequireAuth.tsx` — `useSession()`; loading state while pending; `<Navigate to="/login" />` if no session; else `<Outlet />`.
- `apps/web/src/routes/RedirectIfAuthed.tsx` — inverse guard for `/login`, `/signup`.
- `apps/web/src/pages/LoginPage.tsx` — shadcn `Input`/`Label`/`Button` form, `authClient.signIn.email(...)`, navigate to `/dashboard/projects` on success, inline error on failure, link to `/signup`.
- `apps/web/src/pages/SignupPage.tsx` — same shape with `name` field (required by `User.name`), calls `authClient.signUp.email(...)`.

## 6. Web: dashboard shell

New files:
- `apps/web/src/components/dashboard/Sidebar.tsx` — "Projects" (active link via `NavLink`), "Templates"/"API Keys" shown greyed-out/disabled as future placeholders.
- `apps/web/src/components/dashboard/Topbar.tsx` — avatar + email from `useSession()`, "Sign out" button calling `authClient.signOut()` then navigating to `/login`.
- `apps/web/src/components/dashboard/DashboardLayout.tsx` — sidebar + (topbar above `<Outlet />`) layout, mounted at the `/dashboard` route.

## 7. Web: Projects page

`apps/web/src/pages/ProjectsPage.tsx`:
- Fetch `GET /projects` on mount via `apiFetch` (`useState`/`useEffect` — no react-query needed for one list + one mutation).
- shadcn `Card` + `Table`: Name, Slug, Created; empty state message.
- "New Project" button opens shadcn `Dialog`: name input, live slug preview via `slugify()`, Create/Cancel.
- On submit: `POST /projects`; on success close dialog + refetch; on 409 show inline "slug already in use" error.

---

## Verification

1. `pnpm install` from root; `cd apps/api && pnpm exec prisma migrate dev --name add_project_owner`.
2. Ensure `apps/api/.env` and `apps/web/.env` exist (from `.env.example`) with Postgres running.
3. `pnpm dev` from root (turbo runs both apps).
4. Visit `localhost:5173/` → redirected to `/login`.
5. Sign up → redirected to `/dashboard/projects`; confirm session cookie set on `localhost:4000` (validates CORS + `trustedOrigins`).
6. Create a project → appears in table with correct slug; refresh → still there (validates `ownerId` scoping round-trip).
7. Create a second project with a name colliding on slug → expect 409 + inline error, no crash.
8. Sign out → redirected to `/login`, cookie cleared.
9. While signed out, navigate directly to `/dashboard/projects` → redirected to `/login`; while signed in, navigate to `/login` → redirected to `/dashboard/projects`.
10. `pnpm typecheck` and `pnpm lint` from root pass clean.

### Critical files
- `apps/api/prisma/schema.prisma`
- `apps/api/src/index.ts`
- `apps/web/src/lib/auth-client.ts`
- `apps/web/src/lib/api.ts`
- `apps/web/src/pages/ProjectsPage.tsx`
- `apps/web/src/routes/RequireAuth.tsx`
