'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Minimal token highlighter — a full syntax engine would be a lot of bytes for
 * a handful of marketing snippets, so we colour the few token classes that
 * actually carry meaning here.
 */
const RULES: Array<{ pattern: RegExp; className: string }> = [
  // `//` only starts a comment at a line start or after whitespace, so URLs
  // like postgres://host survive. Same idea for `#` in YAML and shell.
  { pattern: /(^|\s)(\/\/[^\n]*|#[^\n]*)/gm, className: 'text-ink-500' },
  { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, className: 'text-ember-200' },
  {
    pattern:
      /\b(import|from|export|const|let|await|async|new|return|function|class|def|package|func|var|use|require|public|static|void)\b/g,
    className: 'text-seal-400',
  },
  { pattern: /\b(true|false|null|None|nil)\b/g, className: 'text-ink-100' },
]

function highlight(code: string) {
  const marks: Array<{ start: number; end: number; className: string }> = []
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = rule.pattern.exec(code)) !== null) {
      const start = match.index
      const end = start + match[0].length
      // First rule to claim a range wins, so comments beat keywords inside them.
      if (marks.some((m) => start < m.end && end > m.start)) continue
      marks.push({ start, end, className: rule.className })
    }
  }
  marks.sort((a, b) => a.start - b.start)

  const nodes: Array<{ text: string; className?: string }> = []
  let cursor = 0
  for (const mark of marks) {
    if (mark.start > cursor) nodes.push({ text: code.slice(cursor, mark.start) })
    nodes.push({ text: code.slice(mark.start, mark.end), className: mark.className })
    cursor = mark.end
  }
  if (cursor < code.length) nodes.push({ text: code.slice(cursor) })
  return nodes
}

export default function CodeBlock({
  code,
  className,
  copyable = true,
}: {
  code: string
  className?: string
  copyable?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard is unavailable in some embedded contexts — no reason to shout.
    }
  }

  return (
    <div className={cn('group relative', className)}>
      {copyable ? (
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy code"
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg bg-ink-50/6 text-ink-300 opacity-0 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_10%,transparent)] transition-all duration-200 hover:bg-ink-50/12 hover:text-ink-50 focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? <Check className="size-3.5 text-ember-300" /> : <Copy className="size-3.5" />}
        </button>
      ) : null}
      <pre className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-[1.75] text-ink-100">
        <code>
          {highlight(code).map((node, index) => (
            <span key={index} className={node.className}>
              {node.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
