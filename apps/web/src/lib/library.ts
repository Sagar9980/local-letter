// Mirrors the API's /library payloads (apps/api/src/library/index.ts).

export type LibraryTemplate = {
  key: string
  name: string
  description: string
  category: string
  subject: string
  preheader: string
  variables: string[]
  /** Empty in the pack list — only the per-pack endpoint returns markup. */
  html: string
}

export type LibraryPack = {
  id: string
  name: string
  tagline: string
  description: string
  audience: string
  templateCount: number
  colors: { brand: string; accent: string; bg: string; card: string; text: string }
  templates: LibraryTemplate[]
}

export type ImportResult = {
  packId: string
  packName: string
  imported: { id: string; key: string; name: string }[]
  skipped: { key: string; name: string; reason: string }[]
}

// Category → badge label. Unknown values fall through unchanged so a new
// category added to the library still renders something sensible.
const CATEGORY_LABELS: Record<string, string> = {
  onboarding: "Onboarding",
  security: "Security",
  billing: "Billing",
  transactional: "Transactional",
  lifecycle: "Lifecycle",
  marketing: "Marketing",
  operational: "Operational",
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}

/** Wraps a stored body fragment into a document an iframe can render. */
export function toPreviewDocument(html: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>${html}</html>`
}
