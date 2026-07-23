export type TemplateSummary = {
  id: string
  key: string
  name: string
  defaultLocale: string
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
