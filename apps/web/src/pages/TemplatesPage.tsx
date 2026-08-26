import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { FileText, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import { slugify } from "@/lib/slugify"
import type { TemplateSummary } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadTemplates() {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    const query = params.toString()
    const data = await apiFetch<TemplateSummary[]>(
      `/projects/${project.slug}/templates${query ? `?${query}` : ""}`,
    )
    setTemplates(data)
  }

  useEffect(() => {
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, project.slug])

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

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Email templates for {project.name}. Use {"{{variable}}"} for dynamic values.
          </p>
        </div>
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
            <Button>
              <Plus />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Template</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleCreate}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="template-name">Name</Label>
                <Input
                  id="template-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
                {name && <p className="text-sm text-muted-foreground">Key: {slugify(name)}</p>}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create & Edit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {templates?.length ?? 0} template{templates?.length === 1 ? "" : "s"}
          </p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {templates === null ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <FileText className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No templates found</p>
                <p className="text-sm text-muted-foreground">
                  {status !== "all"
                    ? "Try adjusting your filter."
                    : "Create your first email template to get started."}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Locales</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow
                      key={template.id}
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/projects/${project.slug}/templates/${template.key}`)
                      }
                    >
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="text-muted-foreground">{template.key}</TableCell>
                      <TableCell className="max-w-56 truncate text-muted-foreground">
                        {template.subject || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {template.locales.slice(0, 3).map((locale) => (
                            <Badge key={locale} variant="outline" className="font-normal">
                              {locale}
                            </Badge>
                          ))}
                          {template.locales.length > 3 && (
                            <Badge variant="outline" className="font-normal">
                              +{template.locales.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.status === "published" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
