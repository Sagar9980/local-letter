import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HorizonGlow } from '@/components/Glow'

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80dvh] items-center overflow-hidden py-32">
      <HorizonGlow intensity={0.5} />
      <div className="ll-shell relative z-10 text-center">
        <p className="ll-eyebrow">404</p>
        <h1 className="ll-display mt-4 text-ink-50">
          This letter never
          <br />
          <span className="ll-serif ll-gradient-text">reached its address</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-300">
          The page you were looking for does not exist — or has not been published yet.
        </p>
        <Link href="/" className="ll-btn ll-btn-primary group mt-9">
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back home
        </Link>
      </div>
    </section>
  )
}
