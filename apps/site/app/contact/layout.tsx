import type { Metadata } from 'next'

// The page itself is a client component (form state), so its metadata lives
// here in the segment layout.
export const metadata: Metadata = {
  title: 'Contact sales',
  description:
    'Tell us how many locales you send in and where you need Local Letter deployed, and we will come back with a plan that fits.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
