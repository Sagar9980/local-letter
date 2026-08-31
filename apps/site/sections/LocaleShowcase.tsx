'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from '@/components/Reveal'
import AppFrame from '@/components/AppFrame'
import EmailPreview from '@/components/EmailPreview'
import { localeSamples } from '@/lib/locales'

export default function LocaleShowcase() {
  const [active, setActive] = useState(localeSamples[0].code)
  const sample = localeSamples.find((item) => item.code === active) ?? localeSamples[0]

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="ll-shell">
        <div className="grid items-center gap-14 [&>*]:min-w-0 lg:grid-cols-[0.85fr_1fr]">
          <Reveal>
            <p className="ll-eyebrow">One key, every language</p>
            <h2 className="ll-h2 mt-4 text-ink-50">
              Switch the locale,
              <br />
              not the <span className="ll-serif text-ember-200">code path</span>
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-300">
              Your application always asks for the same template key. Local Letter picks the
              published variant for the requested locale, and walks your fallback chain when
              that language has not been translated yet.
            </p>

            <div className="mt-8 rounded-2xl bg-ink-900/50 p-1.5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_7%,transparent)]">
              <div className="flex flex-wrap gap-1.5">
                {localeSamples.map((item) => {
                  const isActive = item.code === active
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setActive(item.code)}
                      aria-pressed={isActive}
                      className="relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[0.8125rem] transition-colors duration-200"
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="locale-chip"
                          className="absolute inset-0 rounded-xl bg-ember-400/14 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_30%,transparent)]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      ) : null}
                      <span className="relative" aria-hidden="true">
                        {item.flag}
                      </span>
                      <span className={isActive ? 'relative text-ember-200' : 'relative text-ink-300'}>
                        {item.label}
                      </span>
                      {item.status === 'draft' ? (
                        <span className="relative rounded-full bg-ink-50/8 px-1.5 py-0.5 text-[0.5625rem] uppercase tracking-wide text-ink-500">
                          Draft
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={sample.code}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-5 text-[0.8125rem] text-ink-500"
              >
                {sample.status === 'draft'
                  ? `“${sample.label}” is still a draft — a production render would fall back to English.`
                  : `Requesting locale “${sample.code}” returns this published variant directly.`}
              </motion.p>
            </AnimatePresence>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-10 -z-10 rounded-[50%] opacity-25 blur-[80px]"
                style={{
                  background:
                    'radial-gradient(closest-side, var(--color-ember-500) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
              <AppFrame label={`POST /v1/render/welcome-email · locale=${sample.code}`}>
                <div className="p-4 sm:p-5">
                  <AnimatePresence mode="wait">
                    <EmailPreview key={sample.code} animateKey={sample.code} sample={sample} />
                  </AnimatePresence>

                  <div className="mt-4 rounded-2xl bg-ink-950/60 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_6%,transparent)]">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500">
                      Response
                    </p>
                    <pre className="mt-2.5 overflow-x-auto font-mono text-[0.7rem] leading-relaxed text-ink-300">
{`{
  "locale":  "${sample.status === 'draft' ? 'en' : sample.code}",
  "subject": "${sample.status === 'draft' ? localeSamples[0].subject : sample.subject}",
  "html":    "<!doctype html>…"
}`}
                    </pre>
                  </div>
                </div>
              </AppFrame>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
