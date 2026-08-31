import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { SectionGlow } from '@/components/Glow'

const before = [
  'Email HTML pasted into template literals across three services',
  'Every locale is a new `if (locale === "fr")` branch',
  'Marketing files a ticket to change one button colour',
  'A missing variable ships as literal `{{first_name}}` to 40,000 inboxes',
]

const after = [
  'One template key, one visual editor, every locale in one place',
  'The SDK resolves the locale and falls back automatically',
  'Non-engineers publish copy changes without a deploy',
  'Required variables are validated before a single email leaves',
]

export default function Problem() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <SectionGlow />
      <div className="ll-shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ll-eyebrow">The problem</p>
          <h2 className="ll-h2 mt-4 text-ink-50">
            Email templates rot in{' '}
            <span className="ll-serif text-ember-200">string literals</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
            Transactional email starts as one hardcoded HTML blob and ends as a maintenance
            problem that nobody owns. Adding a second language usually makes it worse.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-2">
          <RevealItem>
            <div className="ll-panel h-full p-7">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-full bg-seal-500/12 text-seal-400">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <h3 className="text-[0.95rem] font-medium text-ink-50">Without Local Letter</h3>
              </div>
              <ul className="mt-6 space-y-4">
                {before.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-300">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-ink-700" />
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="ll-panel h-full p-7 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_16%,transparent),0_24px_60px_-32px_rgb(0_0_0/0.9)]">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-full bg-ember-400/14 text-ember-300">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="text-[0.95rem] font-medium text-ink-50">With Local Letter</h3>
              </div>
              <ul className="mt-6 space-y-4">
                {after.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-100">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-ember-400" />
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
