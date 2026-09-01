import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { ChevronRight, LayoutTemplate, Plus, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import { slugify } from "@/lib/slugify"
import type { TemplateSummary } from "@/lib/templates"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function TemplatesPage() {
  const navigate = useNavigate()
  const project = useCurrentProject()

  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null)
  const [status, setStatus] = useState<string>("all")
  const [query, setQuery] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadTemplates() {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    const search = params.toString()
    const data = await apiFetch<TemplateSummary[]>(
      `/projects/${project.slug}/templates${search ? `?${search}` : ""}`,
    )
    setTemplates(data)
  }

  useEffect(() => {
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, project.slug])

  const visible = useMemo(() => {
    if (!templates) return null
    const q = query.trim().toLowerCase()
    if (!q) return templates
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q),
    )
  }, [templates, query])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const data = await apiFetch<{ key: string }>(`/projects/${project.slug}/templates`, {
        method: "POST",
        body: JSON.stringify({ name }),
      })
      setIsDialogOpen(false)
      setName("")
      navigate(`/projects/${project.slug}/templates/${data.key}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create template")
    } finally {
      setIsSubmitting(false)
    }
  }

  const newTemplateDialog = (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setName("")
          setError(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-9 rounded-full px-4">
          <Plus />
          New template
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>New template</DialogTitle>
          <DialogDescription>
            The key is what your code passes to the SDK — it stays fixed while the name can change.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="template-name">Name</Label>
            <Input
              id="template-name"
              className="h-10 rounded-xl"
              placeholder="Welcome email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
            <p className="text-xs text-ink-500">
              Key:{" "}
              <span className="font-mono text-ink-300">{name ? slugify(name) : "welcome-email"}</span>
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-9 rounded-full px-4">
              {isSubmitting ? "Creating…" : "Create & edit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 p-5 md:p-8">
        <PageHeader
          eyebrow="Content"
          title="Templates"
          description={
            <>
              Email templates for {project.name}. Wrap dynamic values in{" "}
              <span className="font-mono text-ink-100">{"{{variable}}"}</span> and fill them at send
              time.
            </>
          }
          action={newTemplateDialog}
        />

        <section className="ll-panel overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-ink-50/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates"
                aria-label="Search templates"
                className="h-9 rounded-full border-ink-50/10 bg-ink-50/4 pl-8.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[0.8125rem] text-ink-500">
                {visible?.length ?? 0} template{visible?.length === 1 ? "" : "s"}
              </p>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger size="sm" className="h-9 w-36 rounded-full border-ink-50/10 bg-ink-50/4">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {visible === null ? (
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-12 w-full rounded-lg bg-ink-50/6" />
              <Skeleton className="h-12 w-full rounded-lg bg-ink-50/6" />
              <Skeleton className="h-12 w-full rounded-lg bg-ink-50/6" />
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
              <div className="grid size-12 place-items-center rounded-2xl bg-ember-400/10 ring-1 ring-ember-400/20">
                <LayoutTemplate className="size-5 text-ember-300" />
              </div>
              <div className="max-w-sm">
                <p className="font-medium text-ink-50">
                  {query || status !== "all" ? "Nothing matches those filters" : "No templates yet"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">
                  {query || status !== "all"
                    ? "Try a different search or status."
                    : "Create your first email template — design it once, translate it per locale."}
                </p>
              </div>
              {!query && status === "all" && (
                <Button className="h-9 rounded-full px-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus />
                  New template
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-ink-50/8 hover:bg-transparent">
                  <TableHead className="px-4 text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase">
                    Template
                  </TableHead>
                  <TableHead className="hidden text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase md:table-cell">
                    Subject
                  </TableHead>
                  <TableHead className="text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase">
                    Locales
                  </TableHead>
                  <TableHead className="text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="hidden text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase sm:table-cell">
                    Updated
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((template) => (
                  <TableRow
                    key={template.id}
                    className="group cursor-pointer border-ink-50/6 hover:bg-ink-50/4"
                    onClick={() => navigate(`/projects/${project.slug}/templates/${template.key}`)}
                  >
                    <TableCell className="px-4 py-3">
                      <p className="font-medium text-ink-100">{template.name}</p>
                      <p className="mt-0.5 font-mono text-[0.6875rem] text-ink-500">
                        {template.key}
                      </p>
                    </TableCell>
                    <TableCell className="hidden max-w-56 truncate text-ink-300 md:table-cell">
                      {template.subject || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.locales.slice(0, 3).map((locale) => (
                          <Badge
                            key={locale}
                            variant="outline"
                            className="border-ink-50/10 bg-ink-50/4 font-mono text-[0.625rem] font-normal text-ink-300"
                          >
                            {locale}
                          </Badge>
                        ))}
                        {template.locales.length > 3 && (
                          <Badge
                            variant="outline"
                            className="border-ink-50/10 bg-ink-50/4 text-[0.625rem] font-normal text-ink-500"
                          >
                            +{template.locales.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={template.status} />
                    </TableCell>
                    <TableCell className="hidden text-ink-500 sm:table-cell">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-4">
                      <ChevronRight className="size-3.5 text-ink-700 transition-all group-hover:translate-x-0.5 group-hover:text-ember-300" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  )
}
