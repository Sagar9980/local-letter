import { cn } from "@/lib/utils"

/**
 * The envelope-and-wax-seal mark. Mirrors apps/site/components/Logo.tsx — the
 * dashboard and the marketing site share one identity, so the two files are
 * kept in step by hand.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("size-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="ll-mark-a" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-ember-200)" />
          <stop offset="1" stopColor="var(--color-ember-500)" />
        </linearGradient>
      </defs>
      <rect
        x="4.9"
        y="7.9"
        width="22.2"
        height="16.2"
        rx="4.2"
        stroke="url(#ll-mark-a)"
        strokeWidth="1.9"
      />
      <path
        d="m6.6 10.4 7.5 6a2.9 2.9 0 0 0 3.8 0l7.5-6"
        stroke="url(#ll-mark-a)"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="24" cy="21.6" r="4.4" fill="var(--color-ink-950)" />
      <circle cx="24" cy="21.6" r="2.7" fill="var(--color-seal-500)" />
    </svg>
  )
}

export function Wordmark({
  className,
  markClassName,
}: {
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="text-[0.98rem] font-medium tracking-[-0.02em] text-ink-50">
        Local Letter
      </span>
    </span>
  )
}
