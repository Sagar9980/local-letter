import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Window chrome used for every product mock, so they all read as one app. */
export default function AppFrame({
  children,
  label,
  className,
  bodyClassName,
}: {
  children: ReactNode
  label: string
  className?: string
  bodyClassName?: string
}) {
  return (
    <div
      className={cn(
        'll-panel overflow-hidden rounded-[1.6rem] bg-ink-900/70 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-ink-50/8 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-ink-700" />
          <span className="size-2.5 rounded-full bg-ink-700" />
          <span className="size-2.5 rounded-full bg-ink-700" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-[75%] items-center gap-2 rounded-full bg-ink-950/60 px-3 py-1 text-[0.6875rem] text-ink-500 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_7%,transparent)]">
          <span className="size-1.5 shrink-0 rounded-full bg-ember-400/80" />
          <span className="truncate">{label}</span>
        </div>
        <div className="hidden w-[52px] sm:block" />
      </div>
      <div className={cn(bodyClassName)}>{children}</div>
    </div>
  )
}
