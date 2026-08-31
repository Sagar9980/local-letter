'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Does Local Letter send the email for me?',
    a: 'It can, and it does not have to. The Node SDK will render a template and hand it to Resend in a single call, or return the subject and HTML so you can send it with whatever mailer you already run. Local Letter itself never holds an SMTP connection.',
  },
  {
    q: 'What happens when a locale is not translated yet?',
    a: 'You configure a fallback chain per render call and a default locale per template. If a requested locale has no published variant, the render walks the chain rather than failing — so a half-translated template still ships correct email.',
  },
  {
    q: 'Can non-engineers change templates safely?',
    a: 'That is the point of the draft and publish split. Marketing edits a draft in the visual editor as often as they like; nothing reaches production until the locale is published, and every published version is snapshotted for rollback.',
  },
  {
    q: 'How are API keys scoped?',
    a: 'One key per project. Keys are hashed at rest and shown exactly once at creation. A key can only read templates in its own project, and revoking takes effect on the next request.',
  },
  {
    q: 'Which languages will the SDK support?',
    a: 'Node.js is available now. Python, Go, Ruby and PHP clients are in progress. Until those land, every capability is reachable over a plain authenticated HTTP endpoint, so any language can integrate today.',
  },
  {
    q: 'Where are the docs?',
    a: 'Full documentation is being written and will land at /docs. In the meantime, contact sales and we will walk your team through deployment, template modelling and SDK integration directly.',
  },
  {
    q: 'How do I get pricing?',
    a: 'Talk to sales. Deployments differ enough — team size, locales, support expectations, whether you want help with the initial migration — that a table on a website would tell you the wrong number.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative overflow-hidden border-t border-ink-50/8 py-24 sm:py-32">
      <div className="ll-shell">
        <div className="grid gap-12 [&>*]:min-w-0 lg:grid-cols-[0.7fr_1fr]">
          <Reveal>
            <p className="ll-eyebrow">Questions</p>
            <h2 className="ll-h2 mt-4 text-ink-50">
              Before you
              <br />
              <span className="ll-serif text-ember-200">deploy it</span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="divide-y divide-ink-50/8 border-y border-ink-50/8">
              {faqs.map((faq, index) => {
                const isOpen = open === index
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          'text-[1rem] font-medium tracking-[-0.015em] transition-colors duration-200',
                          isOpen ? 'text-ink-50' : 'text-ink-100',
                        )}
                      >
                        {faq.q}
                      </span>
                      <Plus
                        className={cn(
                          'mt-0.5 size-4 shrink-0 text-ink-500 transition-transform duration-300',
                          isOpen && 'rotate-45 text-ember-300',
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-300">
                            <RichText text={faq.a} />
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
