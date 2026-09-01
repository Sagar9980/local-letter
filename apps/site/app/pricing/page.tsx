import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { HorizonGlow } from '@/components/Glow'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { GithubIcon } from '@/components/BrandIcons'
import { comparison, tiers, type Tier } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Local Letter is free and open source to self-host, with no seat counts, send limits or feature gates. Local Letter Cloud — the fully managed version — is coming soon.',
}

const assurances = [
  {
    title: 'The open source tier stays free',
    body: 'Cloud is a hosting convenience, not a paywall around features. Nothing that works today moves behind a subscription.',
  },
  {
    title: 'No lock-in in either direction',
    body: 'Self-host now and move to Cloud later, or export and come back. It is the same schema and the same API on both sides.',
  },
  {
    title: 'No usage metering on self-host',
    body: 'We do not count your sends, your templates or your seats. There is nothing phoning home to count them with.',
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-16 sm:pt-44">
        <HorizonGlow intensity={0.55} />
        <div className="ll-shell relative z-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="ll-eyebrow">Pricing</p>
            <h1 className="ll-display mt-4 text-ink-50">
              Free to self-host.
              <br />
              <span className="ll-serif ll-gradient-text">Cloud when you want it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
              Run the whole platform yourself at no cost, for as long as you like. When you would
              rather not run it, Local Letter Cloud is on the way.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-8">
        <div className="ll-shell">
          <RevealGroup className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-2" amount={0.1}>
            {tiers.map((tier) => (
              <RevealItem key={tier.id}>
                <TierCard tier={tier} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="relative py-20 sm:py-24">
        <div className="ll-shell">
          <Reveal className="max-w-2xl">
            <p className="ll-eyebrow">Side by side</p>
            <h2 className="ll-h2 mt-4 text-ink-50">
              What actually
              <br />
              <span className="ll-serif text-ember-200">differs</span>
            </h2>
          </Reveal>

          <Reveal delay={0.05} className="mt-10">
            <div className="ll-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ink-50/8">
                      <th className="px-5 py-4 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-ink-500">
                        Capability
                      </th>
                      <th className="px-5 py-4 text-[0.8125rem] font-medium text-ink-50">
                        Open source
                      </th>
                      <th className="px-5 py-4 text-[0.8125rem] font-medium text-ember-200">
                        Cloud
                        <span className="ml-2 rounded-full bg-ember-400/12 px-1.5 py-0.5 text-[0.5625rem] uppercase tracking-wide text-ember-300">
                          Soon
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-ink-50/6 last:border-b-0 transition-colors duration-200 hover:bg-ink-50/3"
                      >
                        <th
                          scope="row"
                          className="px-5 py-3.5 text-[0.875rem] font-normal text-ink-300"
                        >
                          {row.label}
                        </th>
                        <Cell value={row.oss} />
                        <Cell value={row.cloud} accent />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-ink-50/8 py-20 sm:py-24">
        <div className="ll-shell">
          <RevealGroup className="grid gap-8 sm:grid-cols-3">
            {assurances.map((item) => (
              <RevealItem key={item.title}>
                <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em] text-ink-50">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-300">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.06} className="mt-14">
            <div className="ll-panel flex flex-col items-center gap-5 p-8 text-center sm:p-10">
              <h2 className="text-xl font-medium tracking-[-0.02em] text-ink-50 sm:text-2xl">
                Want Cloud on day one?
              </h2>
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-300">
                Tell us how many locales you send in and which region you need. Waitlist teams help
                shape what ships first, and get early access before general availability.
              </p>
              <Link href="/contact" className="ll-btn ll-btn-primary group">
                Join the waitlist
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  const isCloud = tier.id === 'cloud'

  return (
    <div
      className={cn(
        'll-panel relative flex h-full flex-col overflow-hidden p-8 sm:p-9',
        isCloud &&
          'shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_20%,transparent),0_24px_60px_-32px_rgb(0_0_0/0.9)]',
      )}
    >
      {isCloud ? (
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-[22rem] rounded-full opacity-25 blur-[90px]"
          style={{
            background: 'radial-gradient(closest-side, var(--color-ember-500) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      ) : null}

      <div className="relative flex items-center justify-between gap-4">
        <h2 className="text-[1.125rem] font-medium tracking-[-0.02em] text-ink-50">{tier.name}</h2>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.1em]',
            tier.available
              ? 'bg-emerald-400/10 text-emerald-300 shadow-[inset_0_0_0_1px_rgb(52_211_153/0.2)]'
              : 'bg-ember-400/12 text-ember-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_25%,transparent)]',
          )}
        >
          {tier.badge}
        </span>
      </div>

      <div className="relative mt-6 flex items-baseline gap-2.5">
        <span
          className={cn(
            'tracking-[-0.035em] text-ink-50',
            tier.available ? 'text-5xl font-medium' : 'll-serif text-4xl text-ember-200',
          )}
        >
          {tier.price}
        </span>
        <span className="text-[0.8125rem] text-ink-500">{tier.priceNote}</span>
      </div>

      <p className="relative mt-4 text-[0.9375rem] leading-relaxed text-ink-300">{tier.pitch}</p>

      <div className="relative mt-7 flex flex-wrap gap-3">
        {tier.ctaExternal ? (
          <a
            href={tier.ctaHref}
            target="_blank"
            rel="noreferrer"
            className="ll-btn ll-btn-primary group"
          >
            <GithubIcon className="size-4" />
            {tier.ctaLabel}
          </a>
        ) : (
          <Link href={tier.ctaHref} className="ll-btn ll-btn-primary group">
            {tier.ctaLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
        {tier.secondaryLabel && tier.secondaryHref ? (
          <Link href={tier.secondaryHref} className="ll-btn ll-btn-ghost">
            {tier.secondaryLabel}
          </Link>
        ) : null}
      </div>

      <div className="ll-rule relative my-8" />

      <ul className="relative space-y-3.5">
        {tier.includes.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-100">
            <Check className="mt-1 size-3.5 shrink-0 text-ember-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Cell({ value, accent }: { value: string | boolean; accent?: boolean }) {
  return (
    <td className="px-5 py-3.5 text-[0.875rem]">
      {typeof value === 'boolean' ? (
        value ? (
          <Check className={cn('size-4', accent ? 'text-ember-300' : 'text-ember-400/80')} />
        ) : (
          <Minus className="size-4 text-ink-700" />
        )
      ) : (
        <span className={accent ? 'text-ember-200' : 'text-ink-100'}>{value}</span>
      )}
    </td>
  )
}
