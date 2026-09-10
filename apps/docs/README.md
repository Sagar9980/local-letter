# @local-letter/docs

The documentation site for Local Letter — deployment, template modelling,
locale fallback, and the full SDK and HTTP reference. Separate from
`apps/site`, which is the marketing site.

Next.js (App Router) + [Nextra](https://nextra.site) 4 with `nextra-theme-docs`.
Every page is statically prerendered, and full-text search is a
[Pagefind](https://pagefind.app) index built from that output.

```bash
pnpm --filter @local-letter/docs dev      # http://localhost:5175
pnpm --filter @local-letter/docs build
pnpm --filter @local-letter/docs start
```

## Writing pages

Pages are MDX under `content/`, using Nextra's content-directory convention:
the path on disk is the URL.

```
content/index.mdx                 →  /
content/self-hosting.mdx          →  /self-hosting
content/concepts/locales.mdx      →  /concepts/locales
```

Add a page by dropping in an `.mdx` file with frontmatter:

```mdx
---
title: Locales & fallback
description: Shown in search results and social unfurls.
---

# Locales & fallback
```

Sidebar **order and labels** come from the `_meta.ts` file in each directory.
A page missing from `_meta.ts` still renders, but sorts after the listed ones.

> [!WARNING]
> MDX treats `{` as the start of a JavaScript expression, so a bare `{{token}}`
> in prose breaks the build. Wrap tokens in backticks or a fenced code block —
> every page here does.

Built-in components (`Callout`, `Steps`, `Tabs`, `Cards`) are imported per page
from `nextra/components`; they are not globally available.

## Structure

```
app/
  layout.tsx            navbar, brand colours, metadata
  globals.css           palette, fonts, the few theme overrides we make
  opengraph-image.tsx   the 1200x630 social card, generated at build time
  sitemap.ts            built from the same params the catch-all prerenders
  robots.ts
  site-url.ts           the public origin, shared by metadata/sitemap/robots
  [[...mdxPath]]/       catch-all that renders content/ through Nextra
components/Logo.tsx     the mark and navbar wordmark
content/                the docs themselves, one .mdx per page
public/mark.svg         favicon, copied from apps/site
mdx-components.tsx      merges the docs theme's MDX components
next.config.mjs         the Nextra plugin
```

## Branding

The theme is Nextra's, wearing Local Letter's palette. Nothing is forked — the
brand goes in through the theme's own hooks:

| What | Where |
| ---- | ----- |
| Primary colour, page background | `<Head color backgroundColor>` in `app/layout.tsx` |
| Geist / Geist Mono | `next/font` in `app/layout.tsx`, fed to `--x-font-*` in `globals.css` |
| Navbar logo | `<Navbar logo>` with `components/Logo.tsx` |
| Favicon | `metadata.icons` → `public/mark.svg` |

Nextra derives its whole `primary-50…900` scale by shifting one lightness
value, so the light theme runs a lower saturation than the dark one — otherwise
the tint behind the active sidebar item comes out far louder than the rest of
the page. Both themes clear 4.5:1 on links (5.2:1 light, 10.7:1 dark).

## SEO

Set `NEXT_PUBLIC_DOCS_URL` to the origin these docs are served from — canonical
links, `og:url`, the social card, `sitemap.xml` and `robots.txt` are all built
against it, and it defaults to `https://docs.local-letter.sagardhami.com`. See
`.env.example`.

Titles and descriptions come from each page's frontmatter. Next.js applies the
layout's `openGraph.title` template to a page's `openGraph.title`, **not** to
its `title` — so `app/[[...mdxPath]]/page.tsx` copies the page title and
description across in `generateMetadata`. Without that, every page unfurls under
the site default.

## Footer

Nextra's `<Footer>` renders a full-width grey band beneath the content, which is
a lot of chrome for one line of copyright. The `footer` prop is dropped in
`app/layout.tsx`, and the notice is attached instead to the sidebar's own footer
row — the strip that already holds the theme switch and collapse button.

The theme exposes no slot there, so it goes in as a `::before` in
`app/globals.css`, hidden while the sidebar is collapsed to icon width. If a
Nextra upgrade renames `.nextra-sidebar-footer`, the line quietly disappears
rather than breaking the page.

## Search

`pnpm build` runs `postbuild`, which points Pagefind at the prerendered HTML in
`.next/server/app` and writes an index to `public/_pagefind` (gitignored).

Search therefore only works against a **production** build — the dev server has
no index, and the search box will return nothing. That's expected.

## Dependency note

The root `package.json` pins `zod` to `~4.3.6` for `nextra` and
`nextra-theme-docs`. zod 4.4 made `z.custom()` reject missing object keys, which
breaks Nextra 4.6's `<Layout>` prop schema at runtime — every page 500s with
`Invalid input: expected nonoptional → at children`. Drop the override once
Nextra ships a fix.
