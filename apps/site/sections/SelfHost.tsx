import { Database, Lock, Network, Scale } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import CodeBlock from '@/components/CodeBlock'

const guarantees = [
  {
    icon: Database,
    title: 'Your Postgres',
    body: 'Templates, locales and versions live in a database you already back up and audit.',
  },
  {
    icon: Network,
    title: 'Your network',
    body: 'Render calls stay inside your VPC. There is no Local Letter cloud to route through.',
  },
  {
    icon: Lock,
    title: 'Your provider keys',
    body: 'The SDK calls Resend directly with your key. Our API never receives or stores it.',
  },
  {
    icon: Scale,
    title: 'Your compliance story',
    body: 'Customer names and addresses never leave the jurisdiction you deployed into.',
  },
]

const compose = `services:
  api:
    image: ghcr.io/local-letter/api:latest
    environment:
      DATABASE_URL: postgres://letter:pw@db:5432/letter
      WEB_ORIGIN: https://letters.acme.internal
    ports: ["4000:4000"]

  web:
    image: ghcr.io/local-letter/web:latest
    environment:
      VITE_API_URL: https://api.letters.acme.internal
    ports: ["5173:5173"]

  db:
    image: postgres:16
    volumes: ["letter-data:/var/lib/postgresql/data"]`

export default function SelfHost() {
  return (
    <section id="self-host" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="ll-shell">
        <div className="grid gap-14 [&>*]:min-w-0 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="ll-eyebrow">Self-hosted by default</p>
            <h2 className="ll-h2 mt-4 text-ink-50">
              The data stays
              <br />
              <span className="ll-serif text-ember-200">on your side of the wall</span>
            </h2>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-300">
              Local Letter is a Docker Compose stack you run yourself: an Express API, a React
              dashboard and a Postgres database. There is no hosted tier quietly holding your
              customer data.
            </p>

            <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
              {guarantees.map((item) => (
                <RevealItem key={item.title}>
                  <div className="flex gap-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink-50/5 text-ember-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_9%,transparent)]">
                      <item.icon className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-medium text-ink-50">{item.title}</h3>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-500">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="ll-panel overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-ink-50/8 px-5 py-3">
                <span className="size-1.5 rounded-full bg-ember-400/80" />
                <code className="font-mono text-[0.75rem] text-ink-500">docker-compose.yml</code>
              </div>
              <CodeBlock code={compose} />
              <div className="border-t border-ink-50/8 bg-ink-950/40 px-5 py-4">
                <code className="font-mono text-[0.75rem] text-ink-300">
                  <span className="text-ink-700">$ </span>docker compose up -d
                </code>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
