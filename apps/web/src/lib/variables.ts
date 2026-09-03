// Client-side mirror of the API's extractVariables (apps/api/src/library/render.ts)
// — small enough not to be worth sharing across the API/web boundary.

/** Every `{{token}}` referenced across the given strings, in first-appearance order. */
export function extractVariables(...sources: string[]): string[] {
  const seen: string[] = []
  for (const source of sources) {
    for (const match of source.matchAll(/{{\s*([\w.]+)\s*}}/g)) {
      const token = match[1]
      if (!seen.includes(token)) seen.push(token)
    }
  }
  return seen
}

// Suggested even when a template doesn't use them yet, so the picker isn't
// empty for a brand-new template.
export const COMMON_VARIABLES = [
  "first_name",
  "last_name",
  "email",
  "company_name",
  "action_url",
]
