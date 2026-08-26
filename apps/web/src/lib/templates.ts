export type TemplateSummary = {
  id: string
  key: string
  name: string
  defaultLocale: string
  locales: string[]
  status: string
  subject: string
  createdAt: string
  updatedAt: string
}

export type TemplateLocale = {
  id: string
  locale: string
  subject: string
  htmlBody: string
  designJson: unknown
  status: string
}

export type TemplateDetail = {
  id: string
  key: string
  name: string
  defaultLocale: string
  locales: TemplateLocale[]
}

// Mirrors the API's tab order: default locale first, then alphabetical.
export function sortLocales<T extends { locale: string }>(
  locales: T[],
  defaultLocale: string,
): T[] {
  return [...locales].sort((a, b) => {
    if (a.locale === defaultLocale) return -1
    if (b.locale === defaultLocale) return 1
    return a.locale.localeCompare(b.locale)
  })
}
