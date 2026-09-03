import type { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  loading,
}: {
  icon: LucideIcon
  label: string
  value: number | string
  hint?: string
  loading?: boolean
}) {
  return (
    <div className="ll-panel rounded-2xl p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-lg bg-ember-400/10 ring-1 ring-ember-400/20">
          <Icon className="size-3.5 text-ember-300" />
        </span>
        <p className="text-[0.8125rem] text-ink-300">{label}</p>
      </div>
      {loading ? (
        <Skeleton className="mt-4 h-8 w-14 rounded-lg bg-ink-50/6" />
      ) : (
        <p className="mt-3 text-[1.75rem] leading-none font-medium tracking-[-0.03em] text-ink-50 tabular-nums">
          {value}
        </p>
      )}
      {hint && <p className="mt-2 text-xs text-ink-700">{hint}</p>}
    </div>
  )
}
