'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CornerDownRight } from 'lucide-react'
import AppFrame from '@/components/AppFrame'
import EmailPreview from '@/components/EmailPreview'
import {
  localeMeta,
  resolveVariant,
  templates,
  type LocaleCode,
} from '@/lib/templates'
import { cn } from '@/lib/utils'

/**
 * The hero's product mock, and the one place on the site where the core idea
 * is demonstrated rather than described: pick a template, pick a locale, watch
 * the rendered email change — including the fallback when a locale is missing
 * or still a draft.
 */
export default function TemplateWorkbench() {
  const [templateKey, setTemplateKey] = useState(templates[0].key)
  const [locale, setLocale] = useState<LocaleCode>('en')

  const template = templates.find((t) => t.key === templateKey) ?? templates[0]
  const { variant, fellBack } = resolveVariant(template, locale)
  const requested = localeMeta[locale]

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Ember bloom behind the frame so it lifts off the page */}
      <div
        className="pointer-events-none absolute -inset-x-16 -top-10 bottom-10 -z-10 rounded-[50%] opacity-30 blur-[90px]"
        style={{
          background: 'radial-gradient(closest-side, var(--color-ember-500) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <AppFrame label={`localletter.acme.internal / templates / ${template.key}`}>
        <div className="grid gap-0 [&>*]:min-w-0 md:grid-cols-[13rem_1fr]">
          {/* Template rail */}
          <div className="ll-no-scrollbar flex gap-1 overflow-x-auto border-b border-ink-50/8 p-3 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
            <p className="hidden px-3 pb-2 pt-1 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500 md:block">
              Templates
            </p>
            {templates.map((item) => {
              const isActive = item.key === template.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTemplateKey(item.key)}
                  aria-pressed={isActive}
                  className={cn(
                    'relative shrink-0 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 md:w-full',
                    isActive ? 'text-ink-50' : 'hover:bg-ink-50/4',
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="workbench-template"
                      className="absolute inset-0 rounded-xl bg-ink-50/7 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_22%,transparent)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  ) : null}
                  <span
                    className={cn(
                      'relative block font-mono text-[0.75rem]',
                      isActive ? 'text-ink-50' : 'text-ink-300',
                    )}
                  >
                    {item.key}
                  </span>
                  <span className="relative mt-0.5 block whitespace-nowrap text-[0.625rem] text-ink-500">
                    {item.variants.length} locales
                  </span>
                </button>
              )
            })}
          </div>

          {/* Editor + preview */}
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {template.variants.map((item) => {
                const meta = localeMeta[item.code]
                const isActive = item.code === locale
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLocale(item.code)}
                    aria-pressed={isActive}
                    title={`${meta.label}${item.status === 'draft' ? ' (draft)' : ''}`}
                    className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.75rem] transition-colors duration-200"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="workbench-locale"
                        className="absolute inset-0 rounded-full bg-ember-400/14 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_30%,transparent)]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full bg-ink-50/4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_8%,transparent)]" />
                    )}
                    <span className="relative" aria-hidden="true">
                      {meta.flag}
                    </span>
                    <span className={cn('relative', isActive ? 'text-ember-200' : 'text-ink-300')}>
                      {item.code.toUpperCase()}
                    </span>
                    {item.status === 'draft' ? (
                      <span className="relative size-1.5 rounded-full bg-ink-500" />
                    ) : null}
                  </button>
                )
              })}

              <StatusPill fellBack={fellBack} draft={isDraft(template.key, locale)} />
            </div>

            <div className="mt-4 grid gap-4 [&>*]:min-w-0 lg:grid-cols-[1fr_1.05fr]">
              <div className="rounded-2xl bg-ink-950/50 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_6%,transparent)]">
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500">
                  Variables
                </p>
                <div className="mt-3 space-y-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={template.key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      {template.variables.map((v) => (
                        <div
                          key={v.name}
                          className="flex items-center justify-between gap-3 rounded-lg bg-ink-50/3 px-3 py-2"
                        >
                          <code className="truncate font-mono text-[0.7rem] text-ember-200">
                            {`{{${v.name}}}`}
                          </code>
                          <span className="flex shrink-0 items-center gap-1.5 text-[0.625rem] text-ink-500">
                            {v.type}
                            {v.required ? <span className="text-seal-400">*</span> : null}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p className="mt-5 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-500">
                  Fallback chain
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] text-ink-300">
                  <span
                    className={cn(
                      'rounded-md px-2 py-1',
                      fellBack
                        ? 'bg-seal-500/12 text-seal-400 line-through'
                        : 'bg-ember-400/14 text-ember-200',
                    )}
                  >
                    {requested.code}
                  </span>
                  <ArrowRight className="size-3 text-ink-700" />
                  <span
                    className={cn(
                      'rounded-md px-2 py-1',
                      fellBack ? 'bg-ember-400/14 text-ember-200' : 'bg-ink-50/5',
                    )}
                  >
                    {template.fallbackChain[0]}
                  </span>
                  <ArrowRight className="size-3 text-ink-700" />
                  <span className="rounded-md bg-ink-50/5 px-2 py-1 text-ink-500">default</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${template.key}-${locale}-${fellBack}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-4 flex gap-2 text-[0.6875rem] leading-relaxed text-ink-500"
                  >
                    <CornerDownRight className="mt-0.5 size-3 shrink-0 text-ink-700" />
                    {fellBack
                      ? `No published “${requested.code}” variant on this template — served “${variant.code}” instead.`
                      : `Serving the published “${variant.code}” variant.`}
                  </motion.p>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <EmailPreview
                  key={`${template.key}-${variant.code}`}
                  animateKey={`${template.key}-${variant.code}`}
                  template={template}
                  variant={variant}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AppFrame>
    </div>
  )
}

function isDraft(templateKey: string, locale: LocaleCode) {
  const t = templates.find((item) => item.key === templateKey)
  return t?.variants.find((v) => v.code === locale)?.status === 'draft'
}

function StatusPill({ fellBack, draft }: { fellBack: boolean; draft: boolean }) {
  if (draft) {
    return (
      <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-ember-400/10 px-3 py-1.5 text-[0.6875rem] text-ember-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_22%,transparent)] sm:inline-flex">
        <span className="size-1.5 rounded-full bg-ember-400" />
        Draft
      </span>
    )
  }
  if (fellBack) {
    return (
      <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-seal-500/10 px-3 py-1.5 text-[0.6875rem] text-seal-400 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-seal-500)_22%,transparent)] sm:inline-flex">
        <span className="size-1.5 rounded-full bg-seal-500" />
        Fell back
      </span>
    )
  }
  return (
    <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[0.6875rem] text-emerald-300 shadow-[inset_0_0_0_1px_rgb(52_211_153/0.2)] sm:inline-flex">
      <span className="size-1.5 rounded-full bg-emerald-400" />
      Published
    </span>
  )
}
