export const site = {
  name: "Local Letter",
  tagline: "Multi-language email templates, self-hosted.",
  githubUrl: "https://github.com/Sagar9980/local-letter",
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

export type NavItem = (typeof site.nav)[number];

