# @local-letter/site

The public marketing website for Local Letter — what visitors see before they
have an account. Separate from `apps/web`, which is the authenticated dashboard.

Next.js (App Router) + Tailwind v4 + `motion/react`. Every route is statically
prerendered, so the marketing copy is in the HTML for crawlers and social
unfurls.

```bash
pnpm --filter @local-letter/site dev      # http://localhost:5174
pnpm --filter @local-letter/site build
pnpm --filter @local-letter/site start
```

## Routes

| Route      | Purpose                                                          |
| ---------- | ---------------------------------------------------------------- |
| `/`        | Landing page — hero, features, how it works, SDK, self-hosting   |
| `/pricing` | Open source vs. Local Letter Cloud, plus the comparison table    |
| `/contact` | Contact form                                                     |
| `/docs`    | 308 redirect to the docs site — see `next.config.ts`             |

`/pricing` states the open source tier's price (free, MIT) and nothing else:
Cloud is unpriced until launch, and both its calls to action point at
`/contact`. Tiers and the comparison table are data in `lib/pricing.ts`.

## Structure

```
app/            routes, root layout, metadata, globals.css
sections/       the landing page's sections, one file each
components/     shared chrome and primitives
lib/            site config, sample locale data, helpers
```

Server components by default. Only the files that need browser state carry
`'use client'`: `SiteNav`, `Reveal`, `CodeBlock`, `EmailPreview`, and the four
interactive sections (`Hero`, `LocaleShowcase`, `SdkSection`, `Faq`) plus the
contact form.

## Content lives in data, not JSX

Copy that appears in more than one place is defined once:

- `lib/site.ts` — site URL, nav items, GitHub URL, sales address, and
  `docsUrl` / `docsLinks`, which every "Docs" link and the `/docs` redirect
  read from
- `lib/pricing.ts` — the two tiers and the comparison table
- `lib/locales.ts` — the sample template behind every email preview
- Section files own their own lists (features, steps, FAQ, …)

`components/RichText.tsx` renders backticks in that copy as inline code and
`[markdown](links)` as anchors, so prose can be authored as plain strings.

## Contact form

By default the form validates client-side and then opens a pre-filled draft in
the visitor's own mail client. Set `NEXT_PUBLIC_CONTACT_ENDPOINT` (see
`.env.example`) to POST the enquiry as JSON to your own handler instead — the
success state adapts automatically.

## Design system

Tokens and component classes live in `app/globals.css`:

- `--color-ink-*` — the warm near-black base
- `--color-ember-*` / `--color-seal-*` — the stamp and wax accents
- `.ll-shell`, `.ll-panel`, `.ll-btn`, `.ll-display`, `.ll-h2`, `.ll-serif`
- `.ll-glow-*` — the horizon wash, which steps down on phone-width viewports

Fonts are loaded with `next/font` in `app/layout.tsx` and exposed to Tailwind
as `--font-sans` / `--font-mono` / `--font-serif`.

## Component registries

`components.json` registers two shadcn-compatible registries, so components can
be pulled in by name:

```bash
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
pnpm dlx shadcn@latest add @watermelon/hero-14
```

The repo's `.mcp.json` also configures the shadcn MCP server against the same
registries, which lets an agent browse and install them conversationally.

