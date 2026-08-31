'use client'

import { motion } from 'motion/react'
import { interpolate, type LocaleSample } from '@/lib/locales'
import { cn } from '@/lib/utils'

/**
 * A light "email client" card that sits inside the dark product chrome — the
 * contrast is what makes the mock read as an actual rendered email.
 */
export default function EmailPreview({
  sample,
  className,
  animateKey,
}: {
  sample: LocaleSample
  className?: string
  animateKey?: string
}) {
  return (
    <motion.div
      key={animateKey}
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'overflow-hidden rounded-2xl bg-[#FBF9F5] text-[#1B1815] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-black/8 px-5 py-3.5">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1B1815] text-[0.7rem] font-semibold text-[#FBF9F5]">
          A
        </div>
        <div className="min-w-0">
          <p className="truncate text-[0.8125rem] font-semibold leading-tight">
            {interpolate(sample.subject)}
          </p>
          <p className="truncate text-[0.6875rem] text-black/45">
            Acme &lt;hello@acme.com&gt; · to sarah@example.com
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <p className="text-[0.8125rem] font-medium">{interpolate(sample.greeting)}</p>
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-black/70">{sample.body}</p>
        <div className="mt-5">
          <span className="inline-flex items-center rounded-lg bg-[#1B1815] px-4 py-2.5 text-[0.75rem] font-medium text-[#FBF9F5]">
            {sample.cta}
          </span>
        </div>
        <div className="mt-6 h-px bg-black/8" />
        <p className="mt-3 text-[0.625rem] text-black/40">{sample.footer}</p>
      </div>
    </motion.div>
  )
}
