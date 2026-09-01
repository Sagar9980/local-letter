import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/** Draft vs published, shown the same way on every screen: a dot plus the
 *  word, ember once the template is live. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const published = status === "published"

  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 gap-1.5 rounded-full text-[0.6875rem] font-normal capitalize",
        published
          ? "border-ember-400/25 bg-ember-400/10 text-ember-200"
          : "border-ink-50/10 bg-ink-50/4 text-ink-300",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", published ? "bg-ember-400" : "bg-ink-500")} />
      {status}
    </Badge>
  )
}
