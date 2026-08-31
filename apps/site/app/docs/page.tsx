import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { HorizonGlow } from '@/components/Glow'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { site } from '@/lib/site'

const sections = [
  {
    title: 'Getting started',
    items: ['Deploy with Docker Compose', 'Configure your first project', 'Create an API key'],
    status: 'Drafting',
  },
  {
    title: 'Templates',
    items: ['The visual editor', 'Variables and schemas', 'Draft, publish, roll back'],
    status: 'Drafting',
  },
  {
    title: 'Locales',
    items: ['Adding a language variant', 'Default locale and fallback chains', 'Translation workflow'],
    status: 'In review',
  },
  {
    title: 'SDK & API',
    items: ['Node SDK reference', 'HTTP render endpoint', 'Error handling'],
    status: 'In review',
  },
]

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Local Letter documentation is being written — deployment, template modelling, locale fallback and the full SDK reference.',
}

export default function DocsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
        <HorizonGlow intensity={0.55} />
        <div className="ll-shell relative z-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="ll-pill">
              <span className="grid size-5 place-items-center rounded-full bg-ember-400/15">
                <BookOpen className="size-3 text-ember-300" />
              </span>
              Coming soon
            </span>
            <h1 className="ll-display mt-7 text-ink-50">
              Docs are
              <br />
              <span className="ll-serif ll-gradient-text">on the way</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
              We are writing the full reference — deployment, template modelling, locale
              fallback, and every SDK method. Here is what is landing, and how to get answers in
              the meantime.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="ll-btn ll-btn-primary group w-full sm:w-auto">
                Ask our team directly
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="ll-btn ll-btn-ghost w-full sm:w-auto"
              >
                <GithubIcon className="size-4" />
                Read the source
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-28">
        <div className="ll-shell">
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <RevealItem key={section.title}>
                <div className="ll-panel h-full p-7">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-ink-50">
                      {section.title}
                    </h2>
                    <span className="shrink-0 rounded-full bg-ember-400/10 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.1em] text-ember-300">
                      {section.status}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-[0.9375rem] text-ink-300"
                      >
                        <span className="size-1 shrink-0 rounded-full bg-ink-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  )
}
