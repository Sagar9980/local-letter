import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

const githubUrl = 'https://github.com/Sagar9980/local-letter'

export const metadata: Metadata = {
  title: {
    default: 'Local Letter Docs',
    template: '%s – Local Letter Docs',
  },
  description:
    'Documentation for Local Letter — self-hosted transactional email templates with per-locale translations and a typed SDK for Node, Python and Go.',
  applicationName: 'Local Letter Docs',
}

const navbar = (
  <Navbar
    logo={
      <span>
        <b>Local Letter</b> <span style={{ opacity: '60%' }}>Docs</span>
      </span>
    }
    projectLink={githubUrl}
  />
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
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
