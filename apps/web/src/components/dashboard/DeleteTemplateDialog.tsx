import { useEffect, useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type DeletableTemplate = {
  key: string
  name: string
  /** Locale count, shown so the blast radius of the delete is explicit. */
  localeCount?: number
}

/**
 * Confirms and performs a template delete. Deleting takes the template's
 * locales with it and immediately breaks any SDK call rendering that key, so
 * the key has to be typed out — the same guard GitHub and Stripe use for
 * deletes that can't be undone.
 */
export function DeleteTemplateDialog({
  projectSlug,
  template,
  onOpenChange,
  onDeleted,
}: {
  projectSlug: string
  /** `null` closes the dialog; a template opens it for that template. */
  template: DeletableTemplate | null
  onOpenChange: (open: boolean) => void
  onDeleted: (template: DeletableTemplate) => void
}) {
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset between openings, so a previous attempt's typed key or error never
  // carries over to a different template.
  useEffect(() => {
    if (template) {
      setConfirmation("")
      setError(null)
    }
  }, [template])

  async function handleDelete() {
    if (!template) return
    setIsDeleting(true)
    setError(null)

    try {
      await apiFetch(`/projects/${projectSlug}/templates/${template.key}`, {
        method: "DELETE",
      })
      onDeleted(template)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete template")
    } finally {
      setIsDeleting(false)
    }
  }

  const canDelete = confirmation.trim() === template?.key && !isDeleting

  return (
    <Dialog open={template !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {template?.name}?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            This deletes the template and{" "}
            {template?.localeCount && template.localeCount > 1
              ? `all ${template.localeCount} of its locales`
              : "its locale"}
            . Any <code className="font-mono">render</code> call for{" "}
            <code className="font-mono">{template?.key}</code> will start failing with 404.
            This can't be undone.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="delete-confirmation">
              Type <code className="font-mono">{template?.key}</code> to confirm
            </Label>
            <Input
              id="delete-confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!canDelete} onClick={handleDelete}>
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Delete template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
