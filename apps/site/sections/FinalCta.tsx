import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { Reveal } from '@/components/Reveal'
import { HorizonGlow } from '@/components/Glow'
import { site } from '@/lib/site'

export default function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">
      <HorizonGlow intensity={0.7} className="rotate-180" />

      <div className="ll-shell relative z-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ll-eyebrow">Get started</p>
          <h2 className="ll-h2 mt-4 text-ink-50">
            Let&apos;s scope your
            <br />
            <span className="ll-serif ll-gradient-text">email pipeline</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-300">
            Tell us how many locales you send in and where you need it deployed. We will walk
            your team through the stack and put together a plan that fits.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="ll-btn ll-btn-primary group w-full sm:w-auto">
              Contact sales
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="ll-btn ll-btn-ghost w-full sm:w-auto"
            >
              <GithubIcon className="size-4" />
              Read the source first
            </a>
          </div>

          <p className="mt-6 text-[0.8125rem] text-ink-500">
            Free to self-host · MIT licensed · Cloud coming soon
          </p>
        </Reveal>
      </div>
    </section>
  )
}
