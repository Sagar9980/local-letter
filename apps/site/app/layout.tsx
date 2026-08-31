import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const description =
  'Design transactional email templates once, translate them per locale, and render them from any codebase with a typed SDK. Open source, self-hosted — your data never leaves your infrastructure.'

export const metadata: Metadata = {
  metadataBase: new URL('https://localletter.dev'),
  title: {
    default: 'Local Letter — Multi-language email templates, self-hosted',
    template: '%s · Local Letter',
  },
  description,
  openGraph: {
    title: 'Local Letter — Multi-language email templates, self-hosted',
    description,
    type: 'website',
    siteName: 'Local Letter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local Letter — Multi-language email templates, self-hosted',
    description,
  },
  icons: { icon: '/mark.svg' },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <div className="relative flex min-h-dvh flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ember-400 focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
          >
            Skip to content
          </a>
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
