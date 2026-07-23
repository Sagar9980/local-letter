import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import grapesjs from "grapesjs"
import type { Editor } from "grapesjs"
import newsletterPreset from "grapesjs-preset-newsletter"
import "grapesjs/dist/css/grapes.min.css"
import "@/styles/grapesjs-theme.css"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import type { TemplateDetail } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function TemplateEditorPage() {
  const navigate = useNavigate()
  const project = useCurrentProject()
  const { key } = useParams<{ key: string }>()

  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor | null>(null)

  const [template, setTemplate] = useState<TemplateDetail | null>(null)
  const [subject, setSubject] = useState("")
  const [status, setStatus] = useState("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    apiFetch<{ template: TemplateDetail }>(`/projects/${project.slug}/templates/${key}`)
      .then((data) => {
        if (cancelled) return
        setTemplate(data.template)
        const locale = data.template.locales.find((l) => l.locale === data.template.defaultLocale)
        setSubject(locale?.subject ?? "")
        setStatus(locale?.status ?? "draft")
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [project.slug, key])

  useEffect(() => {
    if (!template || !containerRef.current || editorRef.current) return

    const locale = template.locales.find((l) => l.locale === template.defaultLocale)

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      fromElement: false,
      storageManager: false,
      plugins: [newsletterPreset],
    })

    if (locale?.designJson) {
      try {
        editor.loadProjectData(locale.designJson)
      } catch {
        editor.setComponents(locale.htmlBody || "")
      }
    } else if (locale?.htmlBody) {
      editor.setComponents(locale.htmlBody)
    }

    editor.on("update", () => setIsDirty(true))
    editorRef.current = editor

    return () => {
      editor.destroy()
      editorRef.current = null
    }
  }, [template])

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
    if (!editor) return

    setIsSaving(true)
    setError(null)

    try {
      const htmlBody = editor.getHtml()
      const designJson = editor.getProjectData()

      await apiFetch(`/projects/${project.slug}/templates/${key}`, {
        method: "PUT",
        body: JSON.stringify({ subject, htmlBody, designJson }),
      })
      setIsDirty(false)
      setLastSavedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template")
    } finally {
      setIsSaving(false)
    }
  }

  function handlePreview() {
    const editor = editorRef.current
    if (!editor) return

    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>${editor.getHtml()}</body></html>`
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  if (notFound) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="font-medium">Template not found</p>
        <Button variant="outline" onClick={() => navigate(`/projects/${project.slug}/templates`)}>
          Back to templates
        </Button>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/projects/${project.slug}/templates`)}
        >
          <ArrowLeft />
        </Button>
        <Separator orientation="vertical" className="h-5" />
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
            className="h-9 max-w-xl"
          />
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
      </header>

      {error && (
        <p className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="min-h-0 flex-1">
        <div ref={containerRef} className="h-full" />
      </div>
    </div>
  )
}
