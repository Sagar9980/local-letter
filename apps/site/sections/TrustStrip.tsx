const stack = [
  'Node.js',
  'TypeScript',
  'PostgreSQL',
  'Prisma',
  'Express',
  'React',
  'Resend',
  'Docker',
  'GrapesJS',
]

export default function TrustStrip() {
  return (
    <section className="relative border-y border-ink-50/8 bg-ink-950 py-10">
      <div className="ll-shell">
        <p className="text-center text-[0.75rem] uppercase tracking-[0.16em] text-ink-500">
          Drops into the stack you already run
        </p>
      </div>
      <div className="ll-fade-edges relative mt-7 flex overflow-hidden">
        <div className="ll-marquee flex shrink-0 items-center gap-14 pr-14">
          {[...stack, ...stack].map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="whitespace-nowrap text-[0.95rem] font-medium tracking-[-0.01em] text-ink-500/80 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
