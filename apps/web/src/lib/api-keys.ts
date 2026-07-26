export type ApiKeySummary = {
  id: string
  name: string | null
  start: string | null
  prefix: string | null
  enabled: boolean
  lastRequest: string | null
  createdAt: string
}

export type ApiKeyCreated = ApiKeySummary & {
  key: string
}
