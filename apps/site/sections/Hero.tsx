'use client'

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { HorizonGlow } from '@/components/Glow'
import AppFrame from '@/components/AppFrame'
import EmailPreview from '@/components/EmailPreview'
import { localeSamples } from '@/lib/locales'
import { site } from '@/lib/site'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.24, duration: 1.15 },
  },
}

const frameRise: Variants = {
  hidden: { opacity: 0, y: 46, scale: 0.975, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.14, duration: 1.5 },
  },
}

const proofPoints = ['No vendor lock-in', 'Runs in your VPC', 'MIT licensed']

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <HorizonGlow />

      <motion.div
        className="ll-shell relative z-10"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={rise}>
            <span className="ll-pill">
              <span className="grid size-5 place-items-center rounded-full bg-ember-400/15">
                <Sparkles className="size-3 text-ember-300" />
              </span>
              Open source · Self-hosted · Multi-language
            </span>
          </motion.div>

          <motion.h1 variants={rise} className="ll-display mt-7 text-ink-50">
            Transactional email
            <br />
            that speaks{' '}
            <span className="ll-serif ll-gradient-text">every language</span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300"
          >
            Design a template once in a visual editor, translate it per locale, and render it
            from any codebase with one typed SDK call. Your templates, your database, your
            infrastructure.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/contact" className="ll-btn ll-btn-primary group w-full sm:w-auto">
              Contact sales
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="ll-btn ll-btn-ghost w-full sm:w-auto"
            >
              <GithubIcon className="size-4" />
              View the source
            </a>
          </motion.div>

          <motion.ul
            variants={rise}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {proofPoints.map((point) => (
              <li key={point} className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500">
                <Check className="size-3.5 text-ember-400/80" />
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={frameRise} className="relative mt-16 sm:mt-20">
          <HeroMock />
        </motion.div>
      </motion.div>
    </section>
  )
}

function HeroMock() {
  const [en, fr, de, ja] = localeSamples
  const templates = [
    { key: 'welcome-email', locales: 5, active: true },
    { key: 'password-reset', locales: 5, active: false },
    { key: 'invoice-receipt', locales: 4, active: false },
    { key: 'trial-ending', locales: 3, active: false },
  ]

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Ember bloom behind the frame so it lifts off the page */}
      <div
        className="pointer-events-none absolute -inset-x-16 -top-10 bottom-10 -z-10 rounded-[50%] blur-[90px] opacity-30"
        style={{
          background:
            'radial-gradient(closest-side, var(--color-ember-500) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <AppFrame label="localletter.acme.internal / templates / welcome-email">
        <div className="grid gap-0 [&>*]:min-w-0 md:grid-cols-[13rem_1fr]">
          {/* Template rail */}
          <div className="hidden flex-col gap-1 border-r border-ink-50/8 p-3 md:flex">
            <p className="px-3 pb-2 pt-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500">
              Templates
            </p>
            {templates.map((template) => (
              <div
                key={template.key}
                className={
                  template.active
                    ? 'rounded-xl bg-ink-50/7 px-3 py-2.5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_18%,transparent)]'
                    : 'rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50/4'
                }
              >
                <p
                  className={
                    template.active
                      ? 'font-mono text-[0.75rem] text-ink-50'
                      : 'font-mono text-[0.75rem] text-ink-300'
                  }
                >
                  {template.key}
                </p>
                <p className="mt-0.5 text-[0.625rem] text-ink-500">{template.locales} locales</p>
              </div>
            ))}
          </div>

          {/* Editor + preview */}
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {[en, fr, de, ja].map((sample, index) => (
                <span
                  key={sample.code}
                  className={
                    index === 0
                      ? 'inline-flex items-center gap-1.5 rounded-full bg-ember-400/14 px-3 py-1.5 text-[0.75rem] text-ember-200 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_28%,transparent)]'
                      : 'inline-flex items-center gap-1.5 rounded-full bg-ink-50/4 px-3 py-1.5 text-[0.75rem] text-ink-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_8%,transparent)]'
                  }
                >
                  <span aria-hidden="true">{sample.flag}</span>
                  {sample.code.toUpperCase()}
                </span>
              ))}
              <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[0.6875rem] text-emerald-300 shadow-[inset_0_0_0_1px_rgb(52_211_153/0.2)] sm:inline-flex">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Published
              </span>
            </div>

            <div className="mt-4 grid gap-4 [&>*]:min-w-0 lg:grid-cols-[1fr_1.05fr]">
              <div className="rounded-2xl bg-ink-950/50 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_6%,transparent)]">
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500">
                  Variables
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    { name: 'first_name', type: 'string', required: true },
                    { name: 'workspace_url', type: 'url', required: true },
                    { name: 'trial_days', type: 'number', required: false },
                  ].map((variable) => (
                    <div
                      key={variable.name}
                      className="flex items-center justify-between gap-3 rounded-lg bg-ink-50/3 px-3 py-2"
                    >
                      <code className="font-mono text-[0.7rem] text-ember-200">
                        {`{{${variable.name}}}`}
                      </code>
                      <span className="flex items-center gap-1.5 text-[0.625rem] text-ink-500">
                        {variable.type}
                        {variable.required ? (
                          <span className="text-seal-400">*</span>
                        ) : null}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500">
                  Fallback chain
                </p>
                <div className="mt-2.5 flex items-center gap-2 font-mono text-[0.6875rem] text-ink-300">
                  <span className="rounded-md bg-ink-50/5 px-2 py-1">ja</span>
                  <ArrowRight className="size-3 text-ink-700" />
                  <span className="rounded-md bg-ink-50/5 px-2 py-1">en</span>
                  <ArrowRight className="size-3 text-ink-700" />
                  <span className="rounded-md bg-ink-50/5 px-2 py-1 text-ink-500">default</span>
                </div>
              </div>

              <EmailPreview sample={en} />
            </div>
          </div>
        </div>
      </AppFrame>
    </div>
  )
}
