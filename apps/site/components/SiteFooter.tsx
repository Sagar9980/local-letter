import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LogoMark } from '@/components/Logo'
import { site } from '@/lib/site'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'SDK', href: '/#sdk' },
      { label: 'Self-hosting', href: '/#self-host' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Local Letter Cloud', to: '/pricing', note: 'Soon' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', to: '/docs', note: 'Soon' },
      { label: 'Node SDK', href: '/#sdk' },
      { label: 'Other languages', href: '/#sdk', note: 'Soon' },
      { label: 'GitHub', href: site.githubUrl, external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact sales', to: '/contact' },
      { label: 'Talk to an engineer', to: '/contact' },
      { label: 'Security & data residency', href: '/#self-host' },
    ],
  },
] as const

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-50/8 bg-ink-950 pt-16 pb-10">
      <div className="ll-shell">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[0.98rem] font-medium tracking-[-0.02em] text-ink-50">
                Local Letter
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              An open-source platform for designing, translating and rendering transactional
              email — running entirely on your own infrastructure.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[0.8125rem] font-medium tracking-[-0.01em] text-ink-50">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {'to' in link && link.to ? (
                      <Link href={link.to}
                        className="inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-100"
                      >
                        {link.label}
                        {'note' in link && link.note ? <Note>{link.note}</Note> : null}
                      </Link>
                    ) : (
                      <a
                        href={'href' in link ? link.href : '#'}
                        {...('external' in link && link.external
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                        className="inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-100"
                      >
                        {link.label}
                        {'note' in link && link.note ? <Note>{link.note}</Note> : null}
                        {'external' in link && link.external ? (
                          <ArrowUpRight className="size-3 opacity-60" />
                        ) : null}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ll-rule mt-14" />

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Local Letter. Open source, self-hosted.
          </p>
          <p className="text-xs text-ink-500">
            Built for teams who send email in more than one language.
          </p>
        </div>
      </div>
    </footer>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-ember-400/10 px-1.5 py-0.5 text-[0.625rem] font-medium tracking-wide text-ember-300">
      {children}
    </span>
  )
}
