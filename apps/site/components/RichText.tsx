import { Fragment } from 'react'

/**
 * Renders `backtick spans` in marketing copy as inline code, so prose can be
 * authored as plain strings without literal backticks leaking to the page.
 */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g)
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded-md bg-ink-50/7 px-1.5 py-0.5 font-mono text-[0.85em] text-ember-200"
          >
            {part}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
