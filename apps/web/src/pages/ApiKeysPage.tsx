import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Check, Copy, KeySquare, Plus, Trash2 } from "lucide-react"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import type { ApiKeyCreated, ApiKeySummary } from "@/lib/api-keys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

export function ApiKeysPage() {
  const project = useCurrentProject()

  const [keys, setKeys] = useState<ApiKeySummary[] | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdKey, setCreatedKey] = useState<ApiKeyCreated | null>(null)
  const [copied, setCopied] = useState(false)

  async function loadKeys() {
    const data = await apiFetch<{ apiKeys: ApiKeySummary[] }>(
      `/projects/${project.slug}/api-keys`,
    )
    setKeys(data.apiKeys)
  }

  useEffect(() => {
    loadKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const data = await apiFetch<{ apiKey: ApiKeyCreated }>(
        `/projects/${project.slug}/api-keys`,
        { method: "POST", body: JSON.stringify({ name }) },
      )
      setCreatedKey(data.apiKey)
      setName("")
      await loadKeys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRevoke(id: string) {
    if (!window.confirm("Revoke this API key? Any SDK using it will stop working immediately.")) {
      return
    }
    await apiFetch(`/projects/${project.slug}/api-keys/${id}`, { method: "DELETE" })
    await loadKeys()
  }

  async function handleCopy() {
    if (!createdKey) return
    await navigator.clipboard.writeText(createdKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function closeDialog(open: boolean) {
    setIsDialogOpen(open)
    if (!open) {
      setName("")
      setError(null)
      setCreatedKey(null)
      setCopied(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
            <p className="text-sm text-muted-foreground">
              Keys used by the SDK to render templates from {project.name}.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                New API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              {createdKey ? (
                <>
                  <DialogHeader>
                    <DialogTitle>API key created</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      Copy this key now — you won't be able to see it again.
                    </p>
                    <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                      <span className="flex-1 truncate">{createdKey.key}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="text-green-600" /> : <Copy />}
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => closeDialog(false)}>Done</Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>New API Key</DialogTitle>
                  </DialogHeader>
                  <form className="flex flex-col gap-4" onSubmit={handleCreate}>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="api-key-name">Name</Label>
                      <Input
                        id="api-key-name"
                        placeholder="e.g. Production server"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => closeDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <p className="text-sm font-medium">Keys</p>
          </CardHeader>
          <CardContent>
            {keys === null ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : keys.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <KeySquare className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No API keys yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create one to let the SDK render templates from this project.
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
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name || "Untitled"}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {key.prefix ?? key.start ?? "••••••••"}···
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.enabled ? "default" : "secondary"}>
                            {key.enabled ? "active" : "revoked"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRevoke(key.id)}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
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
