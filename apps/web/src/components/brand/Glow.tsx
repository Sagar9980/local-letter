import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

/**
 * The horizon wash used behind the auth screens and empty states — two soft
 * ember/seal blooms over the ink base, plus grain so the gradient can't band.
 * Sizing and opacity live in index.css because both step down on phone-width
 * viewports, where the bloom would otherwise fill the entire screen.
 */
export function HorizonGlow({
  className,
  intensity = 1,
  grid = true,
}: {
  className?: string
  intensity?: number
  grid?: boolean
}) {
  return (
    <div
      className={cn("ll-grain pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ "--ll-glow-intensity": intensity } as CSSProperties}
      aria-hidden="true"
    >
      {grid && <div className="ll-grid-lines ll-fade-bottom absolute inset-0 opacity-60" />}
      <div className="ll-glow ll-glow-primary ll-drift" />
      <div className="ll-glow ll-glow-secondary ll-drift" style={{ animationDelay: "-7s" }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[28rem]"
        style={{ background: "linear-gradient(180deg, transparent, var(--color-ink-950) 82%)" }}
      />
    </div>
  )
}
