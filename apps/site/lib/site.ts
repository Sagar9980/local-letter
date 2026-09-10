export const site = {
  name: "Local Letter",
  /**
   * Public origin this site is served from. Canonical links and og:url are
   * resolved against it, so it has to be the real origin in production —
   * see .env.example.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://local-letter.sagardhami.com",
  tagline: "Multi-language email templates, self-hosted.",
  githubUrl: "https://github.com/Sagar9980/local-letter",
  /**
   * The documentation site (apps/docs), deployed separately. Every "Docs" link
   * on the marketing site reads from here, and /docs redirects to it — see
   * next.config.ts.
   */
  docsUrl: "https://docs.local-letter.sagardhami.com",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "conceptcodes2020@gmail.com",
  /** Kept as data so the nav, footer and CTAs can never drift out of sync. */
  nav: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "SDK", href: "/#sdk" },
    { label: "Pricing", href: "/pricing" },
  ],
} as const;

/** Deep links into the docs, used by the nav, footer and landing page. */
export const docsLinks = {
  gettingStarted: `${site.docsUrl}/getting-started/installation`,
  firstEmail: `${site.docsUrl}/getting-started/first-email`,
  concepts: `${site.docsUrl}/concepts/templates`,
  locales: `${site.docsUrl}/concepts/locales`,
  sdkNode: `${site.docsUrl}/sdks/node`,
  sdkPython: `${site.docsUrl}/sdks/python`,
  sdkGo: `${site.docsUrl}/sdks/go`,
  apiReference: `${site.docsUrl}/api-reference`,
  selfHosting: `${site.docsUrl}/self-hosting`,
} as const;

export type NavItem = (typeof site.nav)[number];

