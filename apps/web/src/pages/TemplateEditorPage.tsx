import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import { ArrowLeft, Eye, Loader2, MoreVertical, Plus, Save, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import grapesjs from "grapesjs"
import type { Editor } from "grapesjs"
import newsletterPreset from "grapesjs-preset-newsletter"
import "grapesjs/dist/css/grapes.min.css"
import "@/styles/grapesjs-theme.css"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { sortLocales } from "@/lib/templates"
import type { TemplateDetail, TemplateLocale } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteTemplateDialog } from "@/components/dashboard/DeleteTemplateDialog"
import type { DeletableTemplate } from "@/components/dashboard/DeleteTemplateDialog"
import { VariablePicker } from "@/components/dashboard/VariablePicker"
import { extractVariables } from "@/lib/variables"

const BLANK = "__blank__"

// GrapesJS keeps components and styles in two separate stores, so getHtml()
// on its own returns markup carrying class names and no styling at all. The
// newsletter preset's inline command joins the two and runs them through juice,
// pushing every rule it can down into `style=""` attributes — the only form
// most email clients reliably honour. Whatever juice can't inline (media
// queries, pseudo-selectors) it leaves behind in a <style> block.
function exportHtml(editor: Editor): string {
  const inlined = editor.runCommand("gjs-get-inlined-html", {
    juiceOpts: { preserveMediaQueries: true, preserveFontFaces: true },
  })
  if (typeof inlined === "string" && inlined.trim()) return inlined

  // The command comes from the preset, so fall back to an un-inlined <style>
  // block rather than silently saving another styleless template.
  const html = editor.getHtml()
  const css = editor.getCss()
  return css ? `${html}<style>${css}</style>` : html
}

export function TemplateEditorPage() {
  const navigate = useNavigate()
  const project = useCurrentProject()
  const { key } = useParams<{ key: string }>()

  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor | null>(null)
  // Suppresses the dirty flag while content is being loaded into the editor
  // programmatically — GrapesJS fires `update` for those changes too.
  const isLoadingRef = useRef(true)
  // Read by the locale-loading effect, which must not re-run on every save.
  const localesRef = useRef<TemplateLocale[]>([])

  const [template, setTemplate] = useState<TemplateDetail | null>(null)
  const [locales, setLocalesState] = useState<TemplateLocale[]>([])
  const [activeLocale, setActiveLocale] = useState("")
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [subject, setSubject] = useState("")
  const [status, setStatus] = useState("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const [pendingDelete, setPendingDelete] = useState<DeletableTemplate | null>(null)

  const usedVariables = useMemo(() => {
    const activeBody = locales.find((l) => l.locale === activeLocale)?.htmlBody ?? ""
    return extractVariables(subject, activeBody)
  }, [subject, locales, activeLocale])

  const [isLocaleDialogOpen, setIsLocaleDialogOpen] = useState(false)
  const [newLocale, setNewLocale] = useState("")
  const [copyFrom, setCopyFrom] = useState(BLANK)
  const [localeError, setLocaleError] = useState<string | null>(null)
  const [isAddingLocale, setIsAddingLocale] = useState(false)

  function setLocales(next: TemplateLocale[]) {
    localesRef.current = next
    setLocalesState(next)
  }

  useEffect(() => {
    let cancelled = false

    apiFetch<TemplateDetail>(`/projects/${project.slug}/templates/${key}`)
      .then((data) => {
        if (cancelled) return
        setTemplate(data)
        setLocales(sortLocales(data.locales, data.defaultLocale))
        setActiveLocale(data.defaultLocale)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [project.slug, key])

  // Keyed on the template id so refetches/edits of the template object don't
  // tear down and rebuild the editor — content swaps happen in the effect below.
  useEffect(() => {
    if (!template || !containerRef.current || editorRef.current) return

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      fromElement: false,
      storageManager: false,
      plugins: [newsletterPreset],
    })

    editor.on("update", () => {
      if (!isLoadingRef.current) setIsDirty(true)
    })

    editorRef.current = editor
    setIsEditorReady(true)

    return () => {
      editor.destroy()
      editorRef.current = null
      setIsEditorReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id])

  // Loads the active locale's design into the editor — on first render and on
  // every tab switch.
  useEffect(() => {
    const editor = editorRef.current
    if (!editor || !isEditorReady || !activeLocale) return

    const locale = localesRef.current.find((l) => l.locale === activeLocale)
    isLoadingRef.current = true

    if (locale?.designJson) {
      try {
        editor.loadProjectData(locale.designJson)
      } catch {
        editor.setStyle("")
        editor.setComponents(locale.htmlBody || "")
      }
    } else {
      // Clear the previous locale's CSS rules too, or they bleed into this one.
      editor.setStyle("")
      editor.setComponents(locale?.htmlBody || "")
    }

    editor.UndoManager.clear()
    setSubject(locale?.subject ?? "")
    setStatus(locale?.status ?? "draft")

    const timer = setTimeout(() => {
      isLoadingRef.current = false
      setIsDirty(false)
    }, 0)

    return () => clearTimeout(timer)
  }, [activeLocale, isEditorReady])

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  async function handleSave() {
    const editor = editorRef.current
    if (!editor || !activeLocale) return

    setIsSaving(true)
    setError(null)

    try {
      const htmlBody = exportHtml(editor)
      const designJson = editor.getProjectData()

      const saved = await apiFetch<TemplateLocale>(
        `/projects/${project.slug}/templates/${key}/locales/${activeLocale}`,
        {
          method: "PUT",
          body: JSON.stringify({ subject, htmlBody, designJson }),
        },
      )

      // Keep the in-memory copy current so switching tabs and back shows the
      // saved design instead of what was last fetched.
      setLocales(
        localesRef.current.map((l) => (l.locale === activeLocale ? { ...l, ...saved } : l)),
      )
      setIsDirty(false)
      setLastSavedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template")
    } finally {
      setIsSaving(false)
    }
  }

  function handleSwitchLocale(locale: string) {
    if (locale === activeLocale) return
    if (
      isDirty &&
      !window.confirm(`Discard unsaved changes to the ${activeLocale} version?`)
    ) {
      return
    }
    setError(null)
    setActiveLocale(locale)
  }

  async function handleAddLocale(e: FormEvent) {
    e.preventDefault()
    setLocaleError(null)
    setIsAddingLocale(true)

    try {
      const created = await apiFetch<TemplateLocale>(
        `/projects/${project.slug}/templates/${key}/locales`,
        {
          method: "POST",
          body: JSON.stringify({
            locale: newLocale.trim(),
            copyFrom: copyFrom === BLANK ? undefined : copyFrom,
          }),
        },
      )

      setLocales(sortLocales([...localesRef.current, created], template!.defaultLocale))
      setIsLocaleDialogOpen(false)
      setNewLocale("")
      setCopyFrom(BLANK)
      setIsDirty(false)
      setActiveLocale(created.locale)
    } catch (err) {
      setLocaleError(err instanceof Error ? err.message : "Failed to add locale")
    } finally {
      setIsAddingLocale(false)
    }
  }

  async function handleDeleteLocale() {
    if (!template || activeLocale === template.defaultLocale) return
    if (
      !window.confirm(
        `Delete the ${activeLocale} version of this template? Sends requesting ${activeLocale} will fall back to ${template.defaultLocale}.`,
      )
    ) {
      return
    }

    try {
      await apiFetch(`/projects/${project.slug}/templates/${key}/locales/${activeLocale}`, {
        method: "DELETE",
      })
      setLocales(localesRef.current.filter((l) => l.locale !== activeLocale))
      setIsDirty(false)
      setActiveLocale(template.defaultLocale)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete locale")
    }
  }

  function handlePreview() {
    const editor = editorRef.current
    if (!editor) return

    // Deliberately the same output that handleSave persists, so the preview
    // shows what recipients get rather than a prettier in-editor rendering.
    const html = `<!doctype html><html><head><meta charset="utf-8"></head>${exportHtml(editor)}</html>`
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
        <p className="font-medium">Template not found</p>
        <Button variant="outline" onClick={() => navigate(`/projects/${project.slug}/templates`)}>
          Back to templates
        </Button>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-muted/40">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-5 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/projects/${project.slug}/templates`)}
        >
          <ArrowLeft />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="min-w-0">
          <p className="truncate text-sm leading-tight font-medium">{template.name}</p>
          <p className="truncate text-xs text-muted-foreground">{template.key}</p>
        </div>
        <Badge variant={status === "published" ? "default" : "secondary"} className="ml-1 shrink-0">
          {status}
        </Badge>

        <div className="mx-2 flex flex-1 items-center gap-2">
          <Label htmlFor="template-subject" className="sr-only">
            Subject
          </Label>
          <Input
            id="template-subject"
            placeholder="Email subject, e.g. Welcome {{first_name}}!"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              setIsDirty(true)
            }}
            className="h-9 max-w-xl bg-muted/40"
          />
          <VariablePicker variables={usedVariables} />
        </div>

        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
          {isSaving
            ? "Saving..."
            : isDirty
              ? "Unsaved changes"
              : lastSavedAt
                ? `Saved at ${lastSavedAt.toLocaleTimeString()}`
                : "No changes yet"}
        </span>

        <Button variant="outline" size="sm" onClick={handlePreview}>
          <Eye />
          Preview
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isSaving || !isDirty}>
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Template actions">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onSelect={() =>
                setPendingDelete({
                  key: template.key,
                  name: template.name,
                  localeCount: locales.length,
                })
              }
            >
              <Trash2 />
              Delete template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex h-11 shrink-0 items-center gap-1 border-b bg-background px-4">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {locales.map((locale) => (
            <button
              key={locale.locale}
              type="button"
              onClick={() => handleSwitchLocale(locale.locale)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                locale.locale === activeLocale
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {locale.locale}
              {locale.locale === template.defaultLocale && (
                <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  default
                </span>
              )}
              {locale.status === "published" && (
                <span className="size-1.5 rounded-full bg-primary" title="Published" />
              )}
            </button>
          ))}
        </div>

        {activeLocale !== template.defaultLocale && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleDeleteLocale}
          >
            <Trash2 />
            Delete {activeLocale}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => setIsLocaleDialogOpen(true)}
        >
          <Plus />
          Add locale
        </Button>
      </div>

      {error && (
        <p className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="min-h-0 flex-1 overflow-hidden bg-muted/40 p-4">
        <div className="mx-auto h-full max-w-6xl overflow-hidden rounded-xl border bg-background shadow-sm">
          <div ref={containerRef} className="h-full" />
        </div>
      </div>

      <DeleteTemplateDialog
        projectSlug={project.slug}
        template={pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onDeleted={() => {
          // Clear the dirty flag first: the template is gone, so the unload
          // guard must not warn about unsaved changes on the way out.
          setIsDirty(false)
          navigate(`/projects/${project.slug}/templates`)
        }}
      />

      <Dialog
        open={isLocaleDialogOpen}
        onOpenChange={(open) => {
          setIsLocaleDialogOpen(open)
          if (!open) {
            setNewLocale("")
            setCopyFrom(BLANK)
            setLocaleError(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add locale</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleAddLocale}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-locale">Locale code</Label>
              <Input
                id="new-locale"
                value={newLocale}
                onChange={(e) => setNewLocale(e.target.value)}
                placeholder="fr, pt-BR, es-MX"
                autoFocus
                required
              />
              <p className="text-sm text-muted-foreground">
                A language code, optionally with a region — the SDK matches this against its{" "}
                <code>locale</code> option.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="copy-from">Start from</Label>
              <Select value={copyFrom} onValueChange={setCopyFrom}>
                <SelectTrigger id="copy-from" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BLANK}>Blank template</SelectItem>
                  {locales.map((locale) => (
                    <SelectItem key={locale.locale} value={locale.locale}>
                      Copy design from {locale.locale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {localeError && <p className="text-sm text-destructive">{localeError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsLocaleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingLocale}>
                {isAddingLocale ? "Adding..." : "Add locale"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
