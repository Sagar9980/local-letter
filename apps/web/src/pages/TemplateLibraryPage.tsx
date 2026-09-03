import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Check,
  Download,
  LayoutTemplate,
  Loader2,
  Sparkles,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { categoryLabel, toPreviewDocument } from "@/lib/library"
import type { ImportResult, LibraryPack, LibraryTemplate } from "@/lib/library"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

function PackList() {
  const navigate = useNavigate()
  const project = useCurrentProject()
  const [packs, setPacks] = useState<LibraryPack[] | null>(null)

  useEffect(() => {
    apiFetch<LibraryPack[]>("/library/packs").then(setPacks)
  }, [])

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Template library</h1>
          <p className="text-sm text-muted-foreground">
            Themed packs of ready-made emails. Install a whole pack or pick individual
            templates — everything lands in {project.name} as an editable draft.
          </p>
        </div>

        {packs === null ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {packs.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => navigate(`/projects/${project.slug}/library/${pack.id}`)}
                className="text-left"
              >
                <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                  <div className="flex h-2">
                    <div className="flex-1" style={{ backgroundColor: pack.colors.brand }} />
                    <div className="w-1/4" style={{ backgroundColor: pack.colors.accent }} />
                    <div className="w-1/6" style={{ backgroundColor: pack.colors.bg }} />
                  </div>
                  <CardHeader className="gap-1 pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">{pack.name}</p>
                      <Badge variant="outline" className="shrink-0 font-normal">
                        {pack.templateCount}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pack.tagline}</p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-3 pb-5">
                    <p className="text-sm text-muted-foreground">{pack.description}</p>
                    <Badge variant="secondary" className="w-fit font-normal">
                      {pack.audience}
                    </Badge>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Pack detail -----------------------------------------------------------

function PackDetail({ packId }: { packId: string }) {
  const navigate = useNavigate()
  const project = useCurrentProject()

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
        setActiveKey(data.templates[0]?.key ?? null)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
    return () => {
      cancelled = true
    }
  }, [packId])

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
