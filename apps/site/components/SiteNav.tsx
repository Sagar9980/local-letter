'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Wordmark } from '@/components/Logo'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'transition-[background-color,box-shadow,backdrop-filter] duration-300',
          scrolled
            ? 'bg-ink-950/72 shadow-[inset_0_-1px_0_0_color-mix(in_oklab,var(--color-ink-50)_9%,transparent)] backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <nav className="ll-shell flex min-h-16 items-center justify-between gap-6">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-85">
            <Wordmark />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {site.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-ink-300 transition-colors duration-200 hover:text-ink-50"
              >
                {item.label}
              </a>
            ))}
            <Link href="/docs"
              className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors duration-200 hover:text-ink-50"
            >
              Docs
              <span className="rounded-full bg-ember-400/12 px-1.5 py-0.5 text-[0.625rem] font-medium tracking-wide text-ember-300">
                SOON
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="ll-btn ll-btn-ghost min-h-10 px-4 text-sm"
            >
              GitHub
              <ArrowUpRight className="size-3.5 opacity-70" />
            </a>
            <Link href="/contact" className="ll-btn ll-btn-primary min-h-10 px-5 text-sm">
              Contact sales
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="ll-btn ll-btn-ghost min-h-10 !px-3 lg:hidden"
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </nav>
      </div>

      {open ? (
        <div className="ll-shell lg:hidden">
          <div className="ll-panel mt-2 flex flex-col gap-1 p-3">
            {site.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-[0.95rem] text-ink-100 transition-colors hover:bg-ink-50/5 hover:text-ink-50"
              >
                {item.label}
              </a>
            ))}
            <Link href="/docs"
              className="flex items-center gap-2 rounded-2xl px-4 py-3 text-[0.95rem] text-ink-100 transition-colors hover:bg-ink-50/5 hover:text-ink-50"
            >
              Docs
              <span className="rounded-full bg-ember-400/12 px-1.5 py-0.5 text-[0.625rem] font-medium text-ember-300">
                SOON
              </span>
            </Link>
            <div className="ll-rule my-2" />
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="ll-btn ll-btn-ghost w-full"
            >
              GitHub
              <ArrowUpRight className="size-3.5 opacity-70" />
            </a>
            <Link href="/contact" className="ll-btn ll-btn-primary mt-1 w-full">
              Contact sales
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
