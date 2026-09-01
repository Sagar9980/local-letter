export interface Tier {
  id: 'oss' | 'cloud'
  name: string
  badge: string
  available: boolean
  price: string
  priceNote: string
  pitch: string
  ctaLabel: string
  ctaHref: string
  ctaExternal?: boolean
  secondaryLabel?: string
  secondaryHref?: string
  includes: string[]
}

export const tiers: Tier[] = [
  {
    id: 'oss',
    name: 'Open source',
    badge: 'Available now',
    available: true,
    price: 'Free',
    priceNote: 'forever, for every feature below',
    pitch:
      'The whole platform, MIT licensed, running on your own infrastructure. No seat counts, no send limits, no feature gates.',
    ctaLabel: 'Deploy it yourself',
    ctaHref: 'https://github.com/Sagar9980/local-letter',
    ctaExternal: true,
    secondaryLabel: 'Read the docs',
    secondaryHref: '/docs',
    includes: [
      'Unlimited templates, locales and projects',
      'Visual drag-and-drop email editor',
      'Per-locale variants with fallback chains',
      'Typed variable schemas and validation',
      'Draft, publish and version rollback',
      'Scoped API keys, hashed at rest',
      'Node SDK and HTTP render API',
      'Your Postgres, your network, your backups',
      'Community support on GitHub',
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    badge: 'Coming soon',
    available: false,
    price: 'Coming soon',
    priceNote: 'pricing announced at launch',
    pitch:
      'The same platform, run by us. For teams who want the product without owning the Postgres, the upgrades or the on-call.',
    ctaLabel: 'Join the waitlist',
    ctaHref: '/contact',
    secondaryLabel: 'Talk to us',
    secondaryHref: '/contact',
    includes: [
      'Everything in Open source',
      'Managed hosting, backups and upgrades',
      'Regional data residency (EU / US)',
      'SSO and SCIM provisioning',
      'Team roles and per-project permissions',
      'Audit logs and change history',
      'Uptime SLA and priority support',
      'Migration help from a self-hosted instance',
    ],
  },
]

export interface ComparisonRow {
  label: string
  oss: string | boolean
  cloud: string | boolean
}

export const comparison: ComparisonRow[] = [
  { label: 'Templates, locales and projects', oss: 'Unlimited', cloud: 'Unlimited' },
  { label: 'Visual editor and versioning', oss: true, cloud: true },
  { label: 'Node SDK and HTTP API', oss: true, cloud: true },
  { label: 'Where your data lives', oss: 'Your infrastructure', cloud: 'EU or US region' },
  { label: 'Who runs upgrades and backups', oss: 'You', cloud: 'We do' },
  { label: 'SSO and SCIM', oss: false, cloud: true },
  { label: 'Audit logs', oss: false, cloud: true },
  { label: 'Support', oss: 'Community', cloud: 'SLA-backed' },
  { label: 'Licence', oss: 'MIT', cloud: 'Subscription' },
]
