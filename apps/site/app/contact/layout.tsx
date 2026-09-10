import type { Metadata } from "next";

// The page itself is a client component (form state), so its metadata lives
// here in the segment layout.
const title = "Contact";
const description =
  "Tell us how many locales you send in and where you need Local Letter deployed, and we will come back with a plan that fits.";

export const metadata: Metadata = {
  title,
  description,
  // Next applies the root layout's openGraph.title template to a page's
  // openGraph.title, not to its `title`, so each page restates both.
  openGraph: { title, description },
  twitter: { title, description },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

