import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export function CodeBlock({
  code,
  filename,
  className,
}: {
  code: string
  filename?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("overflow-hidden rounded-xl bg-ink-950/60 ring-1 ring-ink-50/8", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-ink-50/8 px-3 py-2">
        <span className="truncate font-mono text-[0.6875rem] text-ink-500">{filename ?? "sh"}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[0.6875rem] text-ink-500 transition-colors hover:text-ink-100"
        >
          {copied ? (
            <>
              <Check className="size-3 text-ember-300" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-relaxed text-ink-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}
