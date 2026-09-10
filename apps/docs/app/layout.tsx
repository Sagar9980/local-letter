import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Wordmark } from '@/components/Logo'
import { siteUrl } from './site-url'
import 'nextra-theme-docs/style.css'
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

const githubUrl = 'https://github.com/Sagar9980/local-letter'

const title = 'Local Letter Docs'
const defaultTitle = `${title} — self-hosted, multi-language transactional email`
const titleTemplate = `%s · ${title}`
const description =
  'Documentation for Local Letter — self-hosted transactional email templates with per-locale translations, rendered from Node, Python or Go with one typed SDK call.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Page titles come from each MDX file's frontmatter.
  title: { default: defaultTitle, template: titleTemplate },
  description,
  applicationName: title,
  generator: 'Next.js',
  keywords: [
    'transactional email',
    'email templates',
    'email localization',
    'i18n email',
    'self-hosted',
    'open source',
    'Resend',
    'Node SDK',
    'Python SDK',
    'Go SDK',
  ],
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: title,
    // Templated like `metadata.title`, so each page unfurls under its own
    // name rather than the site default.
    title: { default: defaultTitle, template: titleTemplate },
    description,
    url: './',
  },
  twitter: {
    card: 'summary_large_image',
    title: { default: defaultTitle, template: titleTemplate },
    description,
  },
  robots: { index: true, follow: true },
  icons: { icon: '/mark.svg' },
}

const navbar = <Navbar logo={<Wordmark />} projectLink={githubUrl} />

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      {/*
        Nextra owns the primary colour and page background through CSS
        variables, so the brand is applied here rather than by overriding its
        stylesheet. The amber is Local Letter's ember accent; it darkens on the
        light theme to clear 4.5:1 against the page.
      */}
      <Head
        color={{
          hue: 34,
          // Nextra derives its whole primary scale by shifting this one
          // lightness, so the light theme trades saturation for a calmer
          // active-nav tint while the link colour still clears 4.5:1.
          saturation: { light: 60, dark: 88 },
          lightness: { light: 35, dark: 66 },
        }}
        backgroundColor={{ light: '#fafaf9', dark: '#0a0a0c' }}
      />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase={`${githubUrl}/blob/main/apps/docs`}
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
