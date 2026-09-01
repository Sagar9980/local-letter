import { LogoMark } from "@/components/brand/Logo"

/** Full-screen wait state. The mark breathing on the ink field reads as the
 *  product loading rather than a generic spinner on a blank page. */
export function BrandedLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-4 bg-ink-950">
      <div
        aria-hidden="true"
        className="ll-glow absolute size-72 animate-pulse bg-ember-500/12 blur-[90px]"
      />
      <LogoMark className="relative size-9 animate-pulse" />
      <p className="relative text-[0.8125rem] text-ink-500">{label}</p>
      <span className="sr-only" role="status">
        {label}
      </span>
    </div>
  )
}
