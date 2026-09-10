/**
 * Public origin these docs are served from.
 *
 * Absolute URLs in the page metadata — canonical links, `og:url`, `og:image` —
 * plus the sitemap and robots.txt are all resolved against it, so it has to be
 * the real origin in production. See .env.example.
 */
export const siteUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.local-letter.sagardhami.com'
