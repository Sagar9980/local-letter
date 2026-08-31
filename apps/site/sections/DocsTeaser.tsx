import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const chapters = [
  { title: 'Deploying with Docker Compose', status: 'Drafting' },
  { title: 'Modelling templates and locales', status: 'Drafting' },
  { title: 'Node SDK reference', status: 'In review' },
  { title: 'HTTP API reference', status: 'In review' },
  { title: 'Variable schemas and validation', status: 'Planned' },
  { title: 'Versioning and rollback', status: 'Planned' },
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
                  Documentation coming soon
                </span>
                <h2 className="ll-h2 mt-6 text-ink-50">
                  The manual is
                  <br />
                  <span className="ll-serif text-ember-200">nearly written</span>
                </h2>
                <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-300">
                  We are finishing the deployment guides, the SDK reference and the API docs.
                  Until they publish, our team will onboard you directly — no waiting on a
                  changelog.
                </p>
                <Link href="/contact" className="ll-btn ll-btn-primary group mt-8">
                  Get onboarded now
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <ul className="space-y-px overflow-hidden rounded-2xl bg-ink-50/6">
                {chapters.map((chapter) => (
                  <li
                    key={chapter.title}
                    className="flex items-center justify-between gap-4 bg-ink-950/80 px-5 py-4"
                  >
                    <span className="text-[0.9375rem] text-ink-100">{chapter.title}</span>
                    <span className="shrink-0 rounded-full bg-ink-50/5 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.1em] text-ink-500">
                      {chapter.status}
                    </span>
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
