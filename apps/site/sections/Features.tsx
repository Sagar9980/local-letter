import {
  Blocks,
  GitBranch,
  KeyRound,
  Languages,
  ServerCog,
  ShieldCheck,
  Variable,
} from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Blocks,
    title: 'Drag-and-drop email editor',
    body: 'A GrapesJS newsletter editor that outputs table-based, inlined HTML every email client can actually render. Designers ship without touching a build.',
    span: 'lg:col-span-3',
  },
  {
    icon: Languages,
    title: 'A locale is a variant, not a fork',
    body: 'Every template holds one variant per locale with its own subject, body and design. Request `ja`, get `ja` — or the fallback you configured.',
    span: 'lg:col-span-3',
  },
  {
    icon: Variable,
    title: 'Typed variable schemas',
    body: 'Declare `{{first_name}}` as a required string and the render call rejects a payload that omits it — before it reaches an inbox.',
    span: 'lg:col-span-2',
  },
  {
    icon: GitBranch,
    title: 'Draft, publish, roll back',
    body: 'Edit safely in draft, publish when it is right, and snapshot every version so a bad copy change is one click away from undone.',
    span: 'lg:col-span-2',
  },
  {
    icon: KeyRound,
    title: 'Scoped API keys',
    body: 'One key per project, hashed at rest, shown exactly once. Keys read only their own project, and revoking is instant.',
    span: 'lg:col-span-2',
  },
] as const

const pillars = [
  {
    icon: ServerCog,
    title: 'Runs where you run',
    body: 'Docker Compose, your Postgres, your network. No outbound call leaves your perimeter to render a template.',
  },
  {
    icon: ShieldCheck,
    title: 'Your secrets stay yours',
    body: 'The SDK talks to your mail provider directly. Local Letter never sees, stores or proxies your provider API key.',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="ll-shell">
        <Reveal className="max-w-2xl">
          <p className="ll-eyebrow">Everything in the box</p>
          <h2 className="ll-h2 mt-4 text-ink-50">
            A whole email pipeline,
            <br />
            <span className="ll-serif text-ember-200">minus the SaaS bill</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 lg:grid-cols-6" amount={0.1}>
          {features.map((feature) => (
            <RevealItem key={feature.title} className={cn(feature.span)}>
              <FeatureCard {...feature} />
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-4 grid gap-4 md:grid-cols-2" amount={0.1}>
          {pillars.map((pillar) => (
            <RevealItem key={pillar.title}>
              <div className="ll-panel ll-panel-hover h-full overflow-hidden p-7">
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-ember-400/12 text-ember-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_20%,transparent)]">
                    <pillar.icon className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-ink-50">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-300">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Blocks
  title: string
  body: string
}) {
  return (
    <div className="ll-panel ll-panel-hover group h-full overflow-hidden p-7">
      <span className="grid size-10 place-items-center rounded-2xl bg-ink-50/5 text-ink-100 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_9%,transparent)] transition-colors duration-300 group-hover:bg-ember-400/12 group-hover:text-ember-300">
        <Icon className="size-4.5" />
      </span>
      <h3 className="mt-5 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink-50">
        {title}
      </h3>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-300"><RichText text={body} /></p>
    </div>
  )
}
