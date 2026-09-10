import { ArrowUpRight, BookOpen } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { docsLinks, site } from '@/lib/site'

const chapters = [
  {
    title: 'Installation',
    blurb: 'Clone it, point it at Postgres, run it',
    href: docsLinks.gettingStarted,
  },
  {
    title: 'Send your first email',
    blurb: 'Project, template, API key, one send() call',
    href: docsLinks.firstEmail,
  },
  {
    title: 'Locales & fallback',
    blurb: 'How the right translation gets chosen',
    href: docsLinks.locales,
  },
  {
    title: 'SDK reference',
    blurb: 'Node, Python and Go, method by method',
    href: docsLinks.sdkNode,
  },
  {
    title: 'HTTP API',
    blurb: 'Every endpoint, with its errors',
    href: docsLinks.apiReference,
  },
  {
    title: 'Self-hosting',
    blurb: 'Builds, migrations, secrets and backups',
    href: docsLinks.selfHosting,
  },
]

export default function DocsTeaser() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="ll-shell">
        <Reveal>
          <div className="ll-panel relative overflow-hidden p-8 sm:p-12">
            <div
              className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full opacity-25 blur-[100px]"
              style={{
                background:
                  'radial-gradient(closest-side, var(--color-ember-500) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative grid gap-10 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <span className="ll-pill">
                  <span className="grid size-5 place-items-center rounded-full bg-ember-400/15">
                    <BookOpen className="size-3 text-ember-300" />
                  </span>
                  Documentation
                </span>
                <h2 className="ll-h2 mt-6 text-ink-50">
                  The manual is
                  <br />
                  <span className="ll-serif text-ember-200">written</span>
                </h2>
                <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-300">
                  Deployment, template modelling, locale fallback and every SDK method —
                  documented against the code that ships, not a roadmap. Read it end to end
                  or jump straight to the endpoint you need.
                </p>
                <a
                  href={site.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ll-btn ll-btn-primary group mt-8"
                >
                  Read the docs
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <ul className="space-y-px overflow-hidden rounded-2xl bg-ink-50/6">
                {chapters.map((chapter) => (
                  <li key={chapter.title}>
                    <a
                      href={chapter.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 bg-ink-950/80 px-5 py-4 transition-colors duration-200 hover:bg-ink-900/80"
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem] text-ink-100">
                          {chapter.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.8125rem] text-ink-500">
                          {chapter.blurb}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-ink-500 transition-all duration-200 group-hover:text-ember-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
