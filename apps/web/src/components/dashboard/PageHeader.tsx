import type { ReactNode } from "react"

/** The heading block every dashboard page opens with: eyebrow, title, one
 *  line of orientation, and the page's primary action on the right. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="ll-eyebrow">{eyebrow}</p>
        <h1 className="mt-2 truncate text-[1.625rem] leading-tight font-medium tracking-[-0.03em] text-ink-50">
          {title}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-300">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
