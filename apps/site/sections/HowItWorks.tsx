import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import RichText from '@/components/RichText'

const steps = [
  {
    n: '01',
    title: 'Design it once',
    body: 'Build the template in the visual editor, drop in `{{variables}}`, and declare which ones are required.',
    detail: 'Dashboard',
  },
  {
    n: '02',
    title: 'Translate per locale',
    body: 'Add a variant for each language. Subject, body and layout can differ — the template key never changes.',
    detail: 'Locales',
  },
  {
    n: '03',
    title: 'Publish',
    body: 'Flip the locale from draft to published. Versions are snapshotted, so rolling back is one click.',
    detail: 'Versioning',
  },
  {
    n: '04',
    title: 'Send from anywhere',
    body: 'Your service calls the SDK with a key, a locale and variables. Local Letter renders, your provider delivers.',
    detail: 'SDK',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 overflow-hidden border-y border-ink-50/8 bg-ink-900/30 py-24 sm:py-32"
    >
      <div className="ll-shell">
        <Reveal className="max-w-2xl">
          <p className="ll-eyebrow">How it works</p>
          <h2 className="ll-h2 mt-4 text-ink-50">
            Four steps from blank page
            <br />
            to <span className="ll-serif text-ember-200">delivered inbox</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-ink-50/8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <RevealItem key={step.n} className="bg-ink-950">
              <div className="group relative h-full bg-ink-950 p-7 transition-colors duration-300 hover:bg-ink-900/60">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.75rem] tracking-widest text-ember-400/70">
                    {step.n}
                  </span>
                  <span className="rounded-full bg-ink-50/5 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.12em] text-ink-500">
                    {step.detail}
                  </span>
                </div>
                <h3 className="mt-8 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink-50">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-300"><RichText text={step.body} /></p>
                <span className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-ember-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
