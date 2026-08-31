import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * The horizon wash behind the hero and the closing CTA — two soft ember/seal
 * blooms over the ink base, plus grain so the gradient can't band. Sizing and
 * opacity live in `index.css` because both have to step down on phone-width
 * viewports, where the bloom would otherwise fill the entire screen.
 */
export function HorizonGlow({
  className,
  intensity = 1,
}: {
  className?: string
  intensity?: number
}) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden ll-grain', className)}
      style={{ '--ll-glow-intensity': intensity } as CSSProperties}
      aria-hidden="true"
    >
      <div className="absolute inset-0 ll-grid-lines ll-fade-bottom opacity-60" />
      <div className="ll-glow ll-glow-primary ll-drift" />
      <div className="ll-glow ll-glow-secondary ll-drift" style={{ animationDelay: '-7s' }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[34rem]"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--color-ink-950) 78%)',
        }}
      />
    </div>
  )
}

export function SectionGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[40rem] w-[64rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-[0.14] blur-[110px]"
        style={{
          background: 'radial-gradient(closest-side, var(--color-ember-400) 0%, transparent 72%)',
        }}
      />
    </div>
  )
}
