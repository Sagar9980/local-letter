import { useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Globe,
  KeySquare,
  LayoutTemplate,
  Plus,
  Send,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import type { ApiKeySummary } from "@/lib/api-keys"
import type { TemplateSummary } from "@/lib/templates"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/dashboard/CodeBlock"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const API_URL = import.meta.env.VITE_API_URL

export function ProjectOverviewPage() {
  const project = useCurrentProject()
  const navigate = useNavigate()

  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null)
  const [keys, setKeys] = useState<ApiKeySummary[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setTemplates(null)
    setKeys(null)

    apiFetch<TemplateSummary[]>(`/projects/${project.slug}/templates`)
      .then((data) => !cancelled && setTemplates(data))
      .catch(() => !cancelled && setTemplates([]))

    apiFetch<ApiKeySummary[]>(`/projects/${project.slug}/api-keys`)
      .then((data) => !cancelled && setKeys(data))
      .catch(() => !cancelled && setKeys([]))

    return () => {
      cancelled = true
    }
  }, [project.slug])

  const loading = templates === null || keys === null
  const published = (templates ?? []).filter((t) => t.status === "published").length
  const locales = new Set((templates ?? []).flatMap((t) => t.locales)).size
  const activeKeys = (keys ?? []).filter((k) => k.enabled).length

  const recent = [...(templates ?? [])]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5)

  const firstTemplateKey = templates?.[0]?.key ?? "welcome-email"

  const steps = [
    {
      label: "Design a template",
      body: "Build the layout once, then translate it per locale.",
      done: (templates ?? []).length > 0,
      to: `/projects/${project.slug}/templates`,
      cta: "Open templates",
    },
    {
      label: "Create an API key",
      body: "The SDK authenticates with a project key.",
      done: activeKeys > 0,
      to: `/projects/${project.slug}/api-keys`,
      cta: "Create a key",
    },
    {
      label: "Send from your app",
      body: "One typed call renders and delivers the right locale.",
      done: published > 0 && activeKeys > 0,
      to: `/projects/${project.slug}/templates`,
      cta: "Publish a template",
    },
  ]

  const snippet = `import { TemplateClient } from "local-letter"

const letters = new TemplateClient({
  baseUrl: "${API_URL ?? "https://letters.yourcompany.com"}",
  apiKey: process.env.LOCAL_LETTER_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  from: "hello@yourcompany.com",
})

await letters.send({
  template: "${firstTemplateKey}",
  to: user.email,
  locale: user.locale,
  variables: { first_name: user.firstName },
})`

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-5 md:p-8">
        <PageHeader
          eyebrow="Project"
          title={project.name}
          description={
            <>
              Created {new Date(project.createdAt).toLocaleDateString()} · everything below is
              scoped to <span className="font-mono text-ink-100">{project.slug}</span>.
            </>
          }
          action={
            <Button
              className="h-9 rounded-full px-4"
              onClick={() => navigate(`/projects/${project.slug}/templates`)}
            >
              <Plus />
              New template
            </Button>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={LayoutTemplate}
            label="Templates"
            value={(templates ?? []).length}
            hint={`${published} published`}
            loading={loading}
          />
          <StatCard
            icon={Globe}
            label="Locales"
            value={locales}
            hint="Distinct translations"
            loading={loading}
          />
          <StatCard
            icon={KeySquare}
            label="API keys"
            value={activeKeys}
            hint={activeKeys === 0 ? "None yet" : "Active"}
            loading={loading}
          />
          <StatCard
            icon={Send}
            label="Ready to send"
            value={published > 0 && activeKeys > 0 ? "Yes" : "Not yet"}
            hint="Published template + key"
            loading={loading}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* Recent templates ------------------------------------------- */}
          <section className="ll-panel flex flex-col rounded-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-ink-50/8 px-5 py-3.5">
              <h2 className="text-sm font-medium text-ink-50">Recent templates</h2>
              <Link
                to={`/projects/${project.slug}/templates`}
                className="inline-flex items-center gap-1 text-[0.8125rem] text-ink-500 transition-colors hover:text-ember-300"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3 p-5">
                <Skeleton className="h-10 w-full rounded-lg bg-ink-50/6" />
                <Skeleton className="h-10 w-full rounded-lg bg-ink-50/6" />
                <Skeleton className="h-10 w-full rounded-lg bg-ink-50/6" />
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12 text-center">
                <div className="grid size-11 place-items-center rounded-xl bg-ember-400/10 ring-1 ring-ember-400/20">
                  <LayoutTemplate className="size-5 text-ember-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-50">No templates yet</p>
                  <p className="mt-1 text-sm text-ink-300">
                    Your first template takes about a minute.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="h-8 rounded-full px-3.5"
                  onClick={() => navigate(`/projects/${project.slug}/templates`)}
                >
                  Create a template
                </Button>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-ink-50/6">
                {recent.map((template) => (
                  <li key={template.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/projects/${project.slug}/templates/${template.key}`)
                      }
                      className="group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-ink-50/4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-100">
                          {template.name}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[0.6875rem] text-ink-500">
                          {template.key}
                        </p>
                      </div>
                      <div className="hidden items-center gap-1 sm:flex">
                        {template.locales.slice(0, 3).map((locale) => (
                          <Badge
                            key={locale}
                            variant="outline"
                            className="border-ink-50/10 bg-ink-50/4 font-mono text-[0.625rem] font-normal text-ink-300"
                          >
                            {locale}
                          </Badge>
                        ))}
                      </div>
                      <StatusBadge status={template.status} />
                      <ArrowRight className="size-3.5 shrink-0 text-ink-700 transition-all group-hover:translate-x-0.5 group-hover:text-ember-300" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Setup checklist -------------------------------------------- */}
          <section className="ll-panel flex flex-col rounded-2xl">
            <div className="border-b border-ink-50/8 px-5 py-3.5">
              <h2 className="text-sm font-medium text-ink-50">Get to your first send</h2>
            </div>
            <ol className="flex flex-col gap-1 p-3">
              {steps.map((step, i) => (
                <li key={step.label}>
                  <Link
                    to={step.to}
                    className="group flex gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-ink-50/4"
                  >
                    {step.done ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ember-300" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-ink-700" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-[0.8125rem] font-medium",
                          step.done ? "text-ink-500 line-through" : "text-ink-100",
                        )}
                      >
                        {i + 1}. {step.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{step.body}</p>
                      {!step.done && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[0.75rem] text-ember-300">
                          {step.cta}
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Quick start ------------------------------------------------- */}
        <section className="ll-panel rounded-2xl p-5">
          <div className="flex flex-col gap-1 pb-4">
            <h2 className="text-sm font-medium text-ink-50">Render from your app</h2>
            <p className="text-sm text-ink-300">
              Install <span className="font-mono text-ink-100">local-letter</span>, point it at this
              project, and send. Copy changes ship without a deploy.
            </p>
          </div>
          <div className="grid gap-3">
            <CodeBlock code="npm install local-letter" filename="terminal" />
            <CodeBlock code={snippet} filename="send-welcome.ts" />
          </div>
        </section>
      </div>
    </div>
  )
}

