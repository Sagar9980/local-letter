import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  LayoutTemplate,
  Loader2,
  Mail,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { categoryLabel, toPreviewDocument } from "@/lib/library"
import type { ImportResult, LibraryPack, LibraryTemplate } from "@/lib/library"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/dashboard/PageHeader"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function TemplateLibraryPage() {
  const { packId } = useParams<{ packId?: string }>()
  return packId ? <PackDetail packId={packId} /> : <PackList />
}

// --- Pack list -------------------------------------------------------------

type PackResult = { pack: LibraryPack; hits: LibraryTemplate[] }

// Every whitespace-separated term has to appear somewhere for a match, so
// "invoice reminder" narrows rather than widens. A pack is shown when its own
// copy matches or when any of its templates does; matching templates are
// surfaced on the card so the user can jump straight to them.
function searchPacks(packs: LibraryPack[], query: string): PackResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return packs.map((pack) => ({ pack, hits: [] }))

  const matches = (fields: string[]) => {
    const haystack = fields.join(" ").toLowerCase()
    return terms.every((term) => haystack.includes(term))
  }

  return packs.flatMap((pack) => {
    const hits = pack.templates.filter((t) =>
      matches([t.name, t.key, t.subject, t.description, categoryLabel(t.category)]),
    )
    const packMatches = matches([pack.name, pack.tagline, pack.description, pack.audience])
    return packMatches || hits.length > 0 ? [{ pack, hits }] : []
  })
}

function PackList() {
  const project = useCurrentProject()
  const [packs, setPacks] = useState<LibraryPack[] | null>(null)
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiFetch<LibraryPack[]>("/library/packs").then(setPacks)
  }, [])

  // "/" jumps to search from anywhere on the page, as in most dev tools.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target
      if (
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']")
      )
        return
      e.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const results = useMemo(() => (packs ? searchPacks(packs, query) : null), [packs, query])
  const totalTemplates = packs?.reduce((sum, p) => sum + p.templateCount, 0) ?? 0
  const hitCount = results?.reduce((sum, r) => sum + r.hits.length, 0) ?? 0
  const isSearching = query.trim().length > 0

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-5 md:p-8">
        <PageHeader
          eyebrow="Library"
          title="Template library"
          description={
            <>
              Themed packs of ready-made emails. Install a whole pack or pick individual
              templates — everything lands in {project.name} as an editable draft.
            </>
          }
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-500" />
            <Input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("")
                  e.currentTarget.blur()
                }
              }}
              placeholder="Search packs and templates"
              aria-label="Search packs and templates"
              className="h-10 rounded-full border-ink-50/10 bg-ink-50/4 pr-10 pl-10 text-sm [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("")
                  searchRef.current?.focus()
                }}
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-50/8 hover:text-ink-100"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute top-1/2 right-3 hidden h-5 -translate-y-1/2 items-center rounded-md border border-ink-50/10 px-1.5 font-mono text-[0.6875rem] text-ink-500 sm:flex">
                /
              </kbd>
            )}
          </div>

          {results && (
            <p className="text-[0.8125rem] text-ink-500" aria-live="polite">
              {isSearching ? (
                <>
                  {results.length} pack{results.length === 1 ? "" : "s"}
                  {hitCount > 0 && (
                    <>
                      {" "}
                      · {hitCount} matching template{hitCount === 1 ? "" : "s"}
                    </>
                  )}
                </>
              ) : (
                <>
                  {packs?.length} packs · {totalTemplates} templates
                </>
              )}
            </p>
          )}
        </div>

        {results === null ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[22rem] w-full rounded-2xl" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="ll-panel flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-ink-50/6">
              <Search className="size-4.5 text-ink-300" />
            </div>
            <div>
              <p className="font-medium text-ink-50">No packs match “{query.trim()}”</p>
              <p className="mt-1 text-sm text-ink-300">
                Try a template name like “invoice”, a topic like “security”, or an industry.
              </p>
            </div>
            <Button variant="outline" className="h-9 rounded-full px-4" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ pack, hits }) => (
              <PackCard key={pack.id} pack={pack} hits={hits} projectSlug={project.slug} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PackCard({
  pack,
  hits,
  projectSlug,
}: {
  pack: LibraryPack
  hits: LibraryTemplate[]
  projectSlug: string
}) {
  const href = `/projects/${projectSlug}/library/${pack.id}`
  const categories = [...new Set(pack.templates.map((t) => t.category))]

  return (
    // The whole card is a link via a stretched overlay, so the template
    // chips inside can be links of their own without nesting <a> in <a>.
    <article className="group ll-panel ll-panel-hover flex flex-col rounded-2xl p-1.5">
      <Link
        to={href}
        aria-label={`Open ${pack.name}`}
        className="absolute inset-0 z-0 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />

      <PackPreview pack={pack} />

      <div className="flex flex-1 flex-col gap-3 px-3.5 pt-4 pb-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[0.9375rem] font-medium tracking-[-0.01em] text-ink-50">
              {pack.name}
            </h2>
            <p className="ll-serif mt-0.5 truncate text-[1.0625rem] leading-snug text-ember-200/90">
              {pack.tagline}
            </p>
          </div>
          <span className="mt-0.5 shrink-0 rounded-full bg-ink-50/6 px-2 py-0.5 font-mono text-[0.6875rem] text-ink-300">
            {pack.templateCount} emails
          </span>
        </div>

        <p className="line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-300">
          {pack.description}
        </p>

        {hits.length > 0 ? (
          <div className="relative z-10 flex flex-wrap gap-1.5">
            {hits.slice(0, 3).map((t) => (
              <Link
                key={t.key}
                to={`${href}?template=${encodeURIComponent(t.key)}`}
                className="inline-flex items-center gap-1 rounded-full bg-ember-400/12 px-2.5 py-1 text-xs text-ember-200 ring-1 ring-ember-400/25 transition-colors ring-inset hover:bg-ember-400/20"
              >
                <Mail className="size-3" />
                {t.name}
              </Link>
            ))}
            {hits.length > 3 && (
              <span className="inline-flex items-center px-1.5 py-1 text-xs text-ink-500">
                +{hits.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="rounded-full bg-ink-50/5 px-2.5 py-1 text-xs text-ink-300 ring-1 ring-ink-50/8 ring-inset"
              >
                {categoryLabel(category)}
              </span>
            ))}
            {categories.length > 3 && (
              <span className="px-1.5 py-1 text-xs text-ink-500">+{categories.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-50/8 pt-3">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-ink-500">
            <Users className="size-3.5 shrink-0" />
            <span className="truncate">{pack.audience}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-ink-300 transition-colors group-hover:text-ember-300">
            View pack
            <ArrowRight className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}

/** A miniature, content-free email in the pack's own palette and header
 *  style — two stacked sheets so it reads as a set rather than one message. */
function PackPreview({ pack }: { pack: LibraryPack }) {
  const { brand, accent, bg, card, text } = pack.colors
  const ink = (pct: number) => `color-mix(in oklab, ${text} ${pct}%, transparent)`
  const sheetShadow = "0 1px 2px rgb(0 0 0 / 0.06), 0 12px 28px -12px rgb(0 0 0 / 0.28)"

  return (
    <div
      aria-hidden
      // Dimmed at rest so a dozen light thumbnails don't glare against the
      // dark dashboard; the hovered card comes up to full brightness.
      className="relative h-40 overflow-hidden rounded-xl brightness-[0.88] transition-[filter] duration-500 ease-out-soft group-hover:brightness-100"
      style={{ backgroundColor: bg }}
    >
      <div
        className="absolute inset-x-12 top-3.5 h-full rounded-lg opacity-70 transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5 group-hover:-rotate-2"
        style={{ backgroundColor: card, boxShadow: sheetShadow }}
      />
      <div
        className="absolute inset-x-7 top-6 h-full overflow-hidden rounded-lg transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5"
        style={{ backgroundColor: card, boxShadow: sheetShadow }}
      >
        {pack.headerStyle === "bar" ? (
          <div className="flex h-8 items-center px-3.5" style={{ backgroundColor: brand }}>
            <span className="h-2 w-14 rounded-full bg-white/85" />
          </div>
        ) : pack.headerStyle === "centered" ? (
          <div className="flex flex-col items-center gap-2 pt-3.5 pb-1">
            <span className="h-2 w-12 rounded-full" style={{ backgroundColor: ink(75) }} />
            <span className="h-0.5 w-5" style={{ backgroundColor: brand }} />
          </div>
        ) : (
          <div className="flex h-8 items-center px-3.5" style={{ borderBottom: `1px solid ${ink(10)}` }}>
            <span className="h-2 w-14 rounded-full" style={{ backgroundColor: brand }} />
          </div>
        )}

        <div
          className={cn(
            "flex flex-col gap-1.5 px-3.5 pt-3",
            pack.headerStyle === "centered" && "items-center",
          )}
        >
          <span className="h-2.5 w-3/5 rounded-full" style={{ backgroundColor: ink(78) }} />
          <span className="mt-0.5 h-1.5 w-full rounded-full" style={{ backgroundColor: ink(13) }} />
          <span className="h-1.5 w-4/5 rounded-full" style={{ backgroundColor: ink(13) }} />
          <div className="mt-2 flex items-center gap-2">
            <span className="h-5 w-[4.5rem] rounded-[5px]" style={{ backgroundColor: brand }} />
            <span className="h-1.5 w-8 rounded-full" style={{ backgroundColor: accent }} />
          </div>
        </div>
      </div>
      {/* Hairline + soft fade so the light preview sits into the dark card. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5 ring-inset" />
    </div>
  )
}

// --- Pack detail -----------------------------------------------------------

function PackDetail({ packId }: { packId: string }) {
  const navigate = useNavigate()
  const project = useCurrentProject()
  // Set when arriving from a search hit, so that template opens first.
  const [searchParams] = useSearchParams()
  const requestedKey = searchParams.get("template")

  const [pack, setPack] = useState<LibraryPack | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    apiFetch<LibraryPack>(`/library/packs/${packId}`)
      .then((data) => {
        if (cancelled) return
        setPack(data)
        const requested = data.templates.find((t) => t.key === requestedKey)
        setActiveKey(requested?.key ?? data.templates[0]?.key ?? null)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
    return () => {
      cancelled = true
    }
  }, [packId, requestedKey])

  const active: LibraryTemplate | undefined = useMemo(
    () => pack?.templates.find((t) => t.key === activeKey),
    [pack, activeKey],
  )

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // `keys === undefined` imports the whole pack; the API treats an omitted
  // templateKeys as "everything".
  async function handleImport(keys?: string[]) {
    setIsImporting(true)
    setError(null)
    try {
      const data = await apiFetch<ImportResult>(
        `/projects/${project.slug}/templates/import`,
        {
          method: "POST",
          body: JSON.stringify({ packId, templateKeys: keys }),
        },
      )
      setResult(data)
      setSelected(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import templates")
    } finally {
      setIsImporting(false)
    }
  }

  if (notFound) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="font-medium">Pack not found</p>
        <Button variant="outline" onClick={() => navigate(`/projects/${project.slug}/library`)}>
          Back to the library
        </Button>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => navigate(`/projects/${project.slug}/library`)}
          >
            <ArrowLeft />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold tracking-tight">{pack.name}</h1>
              <span className="flex shrink-0 gap-1">
                {[pack.colors.brand, pack.colors.accent, pack.colors.bg].map((color) => (
                  <span
                    key={color}
                    className="size-3 rounded-full border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </span>
            </div>
            <p className="truncate text-sm text-muted-foreground">{pack.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {selected.size > 0 && (
            <Button
              variant="outline"
              disabled={isImporting}
              onClick={() => handleImport([...selected])}
            >
              <Download />
              Install {selected.size} selected
            </Button>
          )}
          <Button disabled={isImporting} onClick={() => handleImport()}>
            {isImporting ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Install all {pack.templateCount}
          </Button>
        </div>
      </div>

      {error && (
        <p className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_1fr]">
        <div className="min-h-0 overflow-y-auto border-b lg:border-r lg:border-b-0">
          {pack.templates.map((template) => {
            const isSelected = selected.has(template.key)
            return (
              <div
                key={template.key}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border-b px-4 py-3 transition-colors",
                  template.key === activeKey ? "bg-muted" : "hover:bg-muted/50",
                )}
                onClick={() => setActiveKey(template.key)}
              >
                <button
                  type="button"
                  aria-label={isSelected ? `Deselect ${template.name}` : `Select ${template.name}`}
                  aria-pressed={isSelected}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(template.key)
                  }}
                  // Negative margin keeps the 16px box visually aligned while
                  // giving the checkbox a comfortable 32px hit area.
                  className="-m-2 flex shrink-0 p-2"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 items-center justify-center rounded-[4px] border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:border-primary",
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{template.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{template.description}</p>
                </div>
                <Badge variant="outline" className="shrink-0 font-normal">
                  {categoryLabel(template.category)}
                </Badge>
              </div>
            )
          })}
        </div>

        {active ? (
          <div className="flex min-h-0 flex-col">
            <div className="flex flex-col gap-1 border-b px-5 py-3">
              <p className="text-sm font-medium">{active.subject}</p>
              <p className="text-xs text-muted-foreground">{active.preheader}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {active.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="font-mono font-normal">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-muted/40">
              <iframe
                key={active.key}
                title={`${active.name} preview`}
                srcDoc={toPreviewDocument(active.html)}
                sandbox=""
                className="h-full w-full border-0"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            Select a template to preview it
          </div>
        )}
      </div>

      <Dialog open={result !== null} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {result?.imported.length ?? 0} template
              {result?.imported.length === 1 ? "" : "s"} installed
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 text-sm">
            {result && result.imported.length > 0 && (
              <p className="text-muted-foreground">
                Added to {project.name} as drafts. Open one to edit it in the designer.
              </p>
            )}
            {result && result.skipped.length > 0 && (
              <div className="flex flex-col gap-1 rounded-md border p-3">
                <p className="font-medium">
                  {result.skipped.length} skipped — the key is already in use
                </p>
                <ul className="text-muted-foreground">
                  {result.skipped.map((s) => (
                    <li key={s.key} className="font-mono text-xs">
                      {s.key}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResult(null)}>
              Keep browsing
            </Button>
            <Button onClick={() => navigate(`/projects/${project.slug}/templates`)}>
              <LayoutTemplate />
              Go to templates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
