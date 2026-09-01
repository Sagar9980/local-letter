'use client'

import { motion } from 'motion/react'
import { interpolate, type LocaleVariant, type Template } from '@/lib/templates'
import { cn } from '@/lib/utils'

/**
 * A rendered email sitting inside the dark product chrome. It keeps a light
 * "paper" ground the way a real inbox would, but the letterhead, monogram and
 * CTA all carry the site's ember palette so the mock reads as the same brand
 * rather than a default black-on-white template.
 */
export default function EmailPreview({
  template,
  variant,
  className,
  animateKey,
}: {
  template: Template
  variant: LocaleVariant
  className?: string
  animateKey?: string
}) {
  return (
    <motion.div
      key={animateKey}
      initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'overflow-hidden rounded-2xl bg-[#FCF7F0] text-[#241C15]',
        'shadow-[0_30px_60px_-30px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(255_255_255/0.6)]',
        className,
      )}
    >
      {/* Letterhead — the wax-seal gradient that ties the email to the site */}
      <div
        className="h-1"
        style={{
          background:
            'linear-gradient(90deg, var(--color-ember-400), var(--color-seal-400) 55%, var(--color-ember-300))',
        }}
      />

      {/* Inbox header */}
      <div className="flex items-center gap-3 border-b border-[#241C15]/8 bg-[#F6EFE5]/60 px-5 py-3.5">
        <div
          className="grid size-9 shrink-0 place-items-center rounded-xl text-[0.8rem] font-semibold text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.45)]"
          style={{
            background:
              'linear-gradient(160deg, var(--color-ember-400), var(--color-seal-500))',
          }}
          aria-hidden="true"
        >
          A
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-semibold leading-tight tracking-[-0.01em]">
            {interpolate(variant.subject)}
          </p>
          <p className="truncate text-[0.6875rem] text-[#241C15]/50">
            {template.from} · to {template.to}
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-[#241C15]/6 px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.1em] text-[#241C15]/45 sm:inline">
          {variant.code}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#B4622E]">
          {variant.preheader}
        </p>

        <p className="mt-4 text-[0.875rem] font-semibold tracking-[-0.01em]">
          {interpolate(variant.greeting)}
        </p>
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-[#241C15]/72">
          {variant.body}
        </p>

        {variant.details ? (
          <dl className="mt-5 overflow-hidden rounded-xl bg-[#F3EADC]/70 shadow-[inset_0_0_0_1px_rgb(36_28_21/0.07)]">
            {variant.details.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  'flex items-center justify-between gap-4 px-4 py-2.5',
                  index > 0 && 'border-t border-[#241C15]/6',
                )}
              >
                <dt className="text-[0.75rem] text-[#241C15]/55">{row.label}</dt>
                <dd className="text-[0.75rem] font-medium tabular-nums">
                  {interpolate(row.value)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-6">
          <span
            className="inline-flex items-center rounded-xl px-5 py-2.5 text-[0.75rem] font-semibold text-white"
            style={{
              background:
                'linear-gradient(180deg, var(--color-ember-400), var(--color-ember-600))',
              boxShadow:
                'inset 0 1px 0 0 rgb(255 255 255 / 0.4), 0 8px 18px -8px rgb(180 98 46 / 0.7)',
            }}
          >
            {variant.cta}
          </span>
        </div>

        {/* Footer, closed off with a fading ember rule */}
        <div
          className="mt-7 h-px"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in oklab, var(--color-ember-500) 45%, transparent), rgb(36 28 21 / 0.06) 45%, transparent)',
          }}
        />
        <div className="mt-3 flex items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: 'var(--color-seal-500)' }}
            aria-hidden="true"
          />
          <p className="text-[0.625rem] text-[#241C15]/45">{variant.footer}</p>
        </div>
      </div>
    </motion.div>
  )
}
