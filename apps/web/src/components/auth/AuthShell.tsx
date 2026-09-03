import type { ReactNode } from "react"
import { ArrowLeft, Check, Globe, PenLine, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { HorizonGlow } from "@/components/brand/Glow"
import { Wordmark } from "@/components/brand/Logo"
import { site } from "@/lib/site"

const highlights = [
  {
    icon: PenLine,
    title: "Design once",
    body: "Build the template in a visual editor — no HTML email quirks to fight.",
  },
  {
    icon: Globe,
    title: "Translate per locale",
    body: "One key, many languages. The SDK picks the right one at render time.",
  },
  {
    icon: ShieldCheck,
    title: "Stays on your infrastructure",
    body: "Your templates live in your database. Nothing leaves your VPC.",
  },
]

const proofPoints = ["No vendor lock-in", "Runs in your VPC", "MIT licensed"]

const snippet = `const letters = new TemplateClient({
  baseUrl: process.env.LOCAL_LETTER_URL,
  apiKey: process.env.LOCAL_LETTER_API_KEY,
})

await letters.send({
  template: "welcome-email",
  to: user.email,
  locale: user.locale,
})`

/**
 * Split-screen auth layout: the form sits on the left at a comfortable reading
 * width, the brand panel on the right carries the same horizon glow as the
 * marketing hero. The panel is decoration, so it drops out below `lg` rather
 * than stacking and pushing the form below the fold.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative min-h-svh bg-ink-950 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ---- Form column ------------------------------------------------ */}
      <div className="relative flex min-h-svh flex-col px-5 py-8 sm:px-10 lg:min-h-0 lg:py-10">
        <HorizonGlow className="lg:hidden" intensity={0.5} grid={false} />

        <div className="relative flex items-center justify-between">
          <Link to="/" className="transition-opacity hover:opacity-85">
            <Wordmark />
          </Link>
          <a
            href={site.marketingUrl}
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500 transition-colors hover:text-ink-100"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </a>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[25rem]">
            <p className="ll-eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-[1.75rem] leading-tight font-medium tracking-[-0.03em] text-ink-50">
              {title}
            </h1>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-300">{description}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-7 text-center text-sm text-ink-500">{footer}</div>
          </div>
        </div>

        <p className="relative text-center text-xs text-ink-700 lg:text-left">
          © {new Date().getFullYear()} {site.name} · Self-hosted, MIT licensed
        </p>
      </div>

      {/* ---- Brand column ----------------------------------------------- */}
      <div className="relative hidden overflow-hidden border-l border-ink-50/8 lg:block">
        <HorizonGlow />

        <div className="relative flex h-full flex-col justify-center gap-10 px-12 py-14 xl:px-16">
          <div>
            <span className="ll-pill">
              <span className="size-1.5 rounded-full bg-ember-400" />
              Open source · Self-hosted
            </span>
            <h2 className="ll-display mt-6 max-w-lg text-ink-50">
              Transactional email that speaks{" "}
              <span className="ll-serif ll-gradient-text">every language</span>
            </h2>
          </div>

          <ul className="flex max-w-lg flex-col gap-5">
            {highlights.map((item) => (
              <li key={item.title} className="flex gap-3.5">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-ember-400/10 ring-1 ring-ember-400/20">
                  <item.icon className="size-4 text-ember-300" />
                </span>
                <div>
                  <p className="text-[0.9375rem] font-medium text-ink-50">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-300">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="ll-panel max-w-lg rounded-2xl p-4">
            <div className="flex items-center gap-1.5 pb-3">
              <span className="size-2 rounded-full bg-seal-500/70" />
              <span className="size-2 rounded-full bg-ember-400/60" />
              <span className="size-2 rounded-full bg-ink-700" />
              <span className="ml-2 font-mono text-[0.6875rem] text-ink-500">send-welcome.ts</span>
            </div>
            <pre className="overflow-x-auto font-mono text-[0.75rem] leading-relaxed text-ink-300">
              <code>{snippet}</code>
            </pre>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {proofPoints.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500"
              >
                <Check className="size-3.5 text-ember-400/80" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
