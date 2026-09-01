'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Terminal } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import RichText from '@/components/RichText'
import CodeBlock from '@/components/CodeBlock'
import { cn } from '@/lib/utils'

interface Sdk {
  id: string
  label: string
  status: 'available' | 'soon'
  install?: string
  code: string
}

const sdks: Sdk[] = [
  {
    id: 'node',
    label: 'Node.js',
    status: 'available',
    install: 'pnpm add local-letter',
    code: `import { TemplateClient } from "local-letter";

const letters = new TemplateClient({
  baseUrl: process.env.LOCAL_LETTER_URL,
  apiKey: process.env.LOCAL_LETTER_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  from: "hello@acme.com",
});

// Renders the published "fr" variant, then sends it.
const { id, subject } = await letters.send({
  template: "welcome-email",
  to: "sarah@example.com",
  locale: "fr",
  fallbackLocale: "en",
  variables: { first_name: "Sarah" },
});`,
  },
  {
    id: 'python',
    label: 'Python',
    status: 'soon',
    code: `from local_letter import TemplateClient

letters = TemplateClient(
    base_url=os.environ["LOCAL_LETTER_URL"],
    api_key=os.environ["LOCAL_LETTER_API_KEY"],
)

result = letters.render(
    "welcome-email",
    locale="fr",
    fallback_locale="en",
    variables={"first_name": "Sarah"},
)`,
  },
  {
    id: 'go',
    label: 'Go',
    status: 'soon',
    code: `package main

import "github.com/local-letter/go-sdk/letters"

client := letters.New(letters.Config{
    BaseURL: os.Getenv("LOCAL_LETTER_URL"),
    APIKey:  os.Getenv("LOCAL_LETTER_API_KEY"),
})

out, err := client.Render(ctx, "welcome-email", letters.Options{
    Locale:    "fr",
    Variables: map[string]any{"first_name": "Sarah"},
})`,
  },
  {
    id: 'ruby',
    label: 'Ruby',
    status: 'soon',
    code: `require "local_letter"

letters = LocalLetter::Client.new(
  base_url: ENV.fetch("LOCAL_LETTER_URL"),
  api_key:  ENV.fetch("LOCAL_LETTER_API_KEY")
)

result = letters.render(
  "welcome-email",
  locale: "fr",
  variables: { first_name: "Sarah" }
)`,
  },
  {
    id: 'php',
    label: 'PHP',
    status: 'soon',
    code: `use LocalLetter\\TemplateClient;

$letters = new TemplateClient(
    baseUrl: getenv('LOCAL_LETTER_URL'),
    apiKey:  getenv('LOCAL_LETTER_API_KEY'),
);

$result = $letters->render('welcome-email', [
    'locale'    => 'fr',
    'variables' => ['first_name' => 'Sarah'],
]);`,
  },
  {
    id: 'http',
    label: 'HTTP',
    status: 'available',
    code: `curl -X POST "$LOCAL_LETTER_URL/v1/render/welcome-email" \\
  -H "Authorization: Bearer $LOCAL_LETTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "locale": "fr",
    "fallbackLocale": "en",
    "variables": { "first_name": "Sarah" }
  }'`,
  },
]

export default function SdkSection() {
  const [activeId, setActiveId] = useState('node')
  const active = sdks.find((sdk) => sdk.id === activeId) ?? sdks[0]

  return (
    <section
      id="sdk"
      className="relative scroll-mt-32 overflow-hidden border-y border-ink-50/8 bg-ink-900/30 py-24 sm:py-32"
    >
      <div className="ll-shell">
        <div className="grid gap-12 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-36">
            <p className="ll-eyebrow">Built for your codebase</p>
            <h2 className="ll-h2 mt-4 text-ink-50">
              One call.
              <br />
              <span className="ll-serif text-ember-200">Any service.</span>
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-300">
              The Node SDK is shipping today: it renders the template against your instance and
              hands the result to your mail provider. Everything is a plain authenticated HTTP
              call underneath, so any language can talk to it right now.
            </p>

            <div className="mt-8 space-y-3">
              <Feature label="Typed errors" detail="Render failures and send failures stay distinguishable." />
              <Feature label="Locale fallback" detail="Ask for `ja`, get `ja` — or the chain you configured." />
              <Feature label="No mailer lock-in" detail="Render-only mode hands you subject + HTML to send yourself." />
            </div>

            <div className="mt-8 rounded-2xl bg-ink-950/60 p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_14%,transparent)]">
              <p className="text-[0.8125rem] font-medium text-ink-50">
                SDKs for other languages are coming
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-300">
                Python, Go, Ruby and PHP clients are in progress. Tell us which one you need
                first and we will prioritise it.
              </p>
              <Link href="/contact"
                className="group mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] text-ember-300 transition-colors hover:text-ember-200"
              >
                Request a language
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="ll-panel overflow-hidden">
              <div className="flex flex-wrap items-center gap-1 border-b border-ink-50/8 p-2">
                {sdks.map((sdk) => {
                  const isActive = sdk.id === activeId
                  return (
                    <button
                      key={sdk.id}
                      type="button"
                      onClick={() => setActiveId(sdk.id)}
                      className={cn(
                        'relative inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[0.8125rem] transition-colors duration-200',
                        isActive ? 'text-ink-50' : 'text-ink-500 hover:text-ink-100',
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="sdk-tab"
                          className="absolute inset-0 rounded-xl bg-ink-50/8 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_10%,transparent)]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      ) : null}
                      <span className="relative">{sdk.label}</span>
                      {sdk.status === 'soon' ? (
                        <span className="relative rounded-full bg-ember-400/12 px-1.5 py-0.5 text-[0.5625rem] font-medium uppercase tracking-wide text-ember-300">
                          Soon
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {active.install ? (
                <div className="flex items-center gap-2.5 border-b border-ink-50/8 bg-ink-950/40 px-5 py-3">
                  <Terminal className="size-3.5 shrink-0 text-ink-500" />
                  <code className="font-mono text-[0.75rem] text-ink-300">{active.install}</code>
                </div>
              ) : null}

              {active.status === 'soon' ? (
                <div className="flex items-center gap-2.5 border-b border-ink-50/8 bg-ember-400/6 px-5 py-3">
                  <span className="size-1.5 shrink-0 rounded-full bg-ember-400" />
                  <p className="text-[0.75rem] text-ember-200">
                    Planned API — the {active.label} client is not published yet. Use the HTTP tab
                    today.
                  </p>
                </div>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <CodeBlock code={active.code} />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Feature({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 size-1 shrink-0 rounded-full bg-ember-400" />
      <p className="text-[0.9375rem] leading-relaxed text-ink-300">
        <span className="text-ink-50">{label}.</span> <RichText text={detail} />
      </p>
    </div>
  )
}
