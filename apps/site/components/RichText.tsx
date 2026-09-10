import { Fragment } from 'react'
import Link from 'next/link'

/**
 * Renders `backtick spans` in marketing copy as inline code and
 * [markdown](links) as anchors, so prose can be authored as plain strings
 * without literal backticks or JSX leaking into the copy.
 *
 * Links starting with "/" route internally; anything else is treated as
 * external and opens in a new tab.
 */
const TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g

export default function RichText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(TOKEN)) {
    const [raw, code, label, href] = match
    const start = match.index

    if (start > cursor) {
      nodes.push(<Fragment key={cursor}>{text.slice(cursor, start)}</Fragment>)
    }

    if (code !== undefined) {
      nodes.push(
        <code
          key={start}
          className="rounded-md bg-ink-50/7 px-1.5 py-0.5 font-mono text-[0.85em] text-ember-200"
        >
          {code}
        </code>,
      )
    } else if (href.startsWith('/')) {
      nodes.push(
        <Link key={start} href={href} className="ll-link">
          {label}
        </Link>,
      )
    } else {
      nodes.push(
        <a key={start} href={href} target="_blank" rel="noreferrer" className="ll-link">
          {label}
        </a>,
      )
    }

    cursor = start + raw.length
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key={cursor}>{text.slice(cursor)}</Fragment>)
  }

  return <>{nodes}</>
}
