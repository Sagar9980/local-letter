import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { AlertTriangle, Check, Copy, KeySquare, Plus, Trash2 } from "lucide-react"
import { useCurrentProject } from "@/lib/project-context"
import { apiFetch } from "@/lib/api"
import type { ApiKeyCreated, ApiKeySummary } from "@/lib/api-keys"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
    const data = await apiFetch<ApiKeySummary[]>(`/projects/${project.slug}/api-keys`)
    setKeys(data)
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
      const data = await apiFetch<ApiKeyCreated>(`/projects/${project.slug}/api-keys`, {
        method: "POST",
        body: JSON.stringify({ name }),
      })
      setCreatedKey(data)
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

  const newKeyDialog = (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-full px-4">
          <Plus />
          New API key
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        {createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>API key created</DialogTitle>
              <DialogDescription>
                Store it in your server environment as{" "}
                <span className="font-mono text-ink-100">LOCAL_LETTER_API_KEY</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5 rounded-xl bg-ember-400/8 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-ember-200 ring-1 ring-ember-400/20">
                <AlertTriangle className="mt-px size-4 shrink-0" />
                <span>Copy it now — this is the only time the full key is shown.</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-ink-950/60 px-3 py-2.5 ring-1 ring-ink-50/8">
                <span className="flex-1 truncate font-mono text-[0.8125rem] text-ink-100">
                  {createdKey.key}
                </span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={handleCopy}>
                  {copied ? <Check className="text-ember-300" /> : <Copy />}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button className="h-9 rounded-full px-4" onClick={() => closeDialog(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New API key</DialogTitle>
              <DialogDescription>
                Name it after where it runs, so revoking the right one later is obvious.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleCreate}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="api-key-name">Name</Label>
                <Input
                  id="api-key-name"
                  className="h-10 rounded-xl"
                  placeholder="Production server"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => closeDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-9 rounded-full px-4">
                  {isSubmitting ? "Creating…" : "Create key"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 p-5 md:p-8">
        <PageHeader
          eyebrow="Access"
          title="API keys"
          description={`Keys the SDK uses to render and send templates from ${project.name}. Keep them server-side.`}
          action={newKeyDialog}
        />

        <section className="ll-panel overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-ink-50/8 px-4 py-3">
            <h2 className="text-sm font-medium text-ink-50">Keys</h2>
            <p className="text-[0.8125rem] text-ink-500">
              {keys?.length ?? 0} key{keys?.length === 1 ? "" : "s"}
            </p>
          </div>

          {keys === null ? (
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-12 w-full rounded-lg bg-ink-50/6" />
              <Skeleton className="h-12 w-full rounded-lg bg-ink-50/6" />
            </div>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
              <div className="grid size-12 place-items-center rounded-2xl bg-ember-400/10 ring-1 ring-ember-400/20">
                <KeySquare className="size-5 text-ember-300" />
              </div>
              <div className="max-w-sm">
                <p className="font-medium text-ink-50">No API keys yet</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">
                  Create one to let your backend render templates from this project.
                </p>
              </div>
              <Button className="h-9 rounded-full px-4" onClick={() => setIsDialogOpen(true)}>
                <Plus />
                New API key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-ink-50/8 hover:bg-transparent">
                  <TableHead className="px-4 text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase">
                    Name
                  </TableHead>
                  <TableHead className="text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase">
                    Key
                  </TableHead>
                  <TableHead className="text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="hidden text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase sm:table-cell">
                    Last used
                  </TableHead>
                  <TableHead className="hidden text-[0.6875rem] tracking-[0.1em] text-ink-500 uppercase sm:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id} className="border-ink-50/6 hover:bg-ink-50/4">
                    <TableCell className="px-4 py-3 font-medium text-ink-100">
                      {key.name || "Untitled"}
                    </TableCell>
                    <TableCell className="font-mono text-[0.8125rem] text-ink-500">
                      {key.prefix ?? key.start ?? "••••••••"}
                      <span className="text-ink-700">···</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 gap-1.5 rounded-full text-[0.6875rem] font-normal",
                          key.enabled
                            ? "border-ember-400/25 bg-ember-400/10 text-ember-200"
                            : "border-seal-500/25 bg-seal-500/10 text-seal-400",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            key.enabled ? "bg-ember-400" : "bg-seal-500",
                          )}
                        />
                        {key.enabled ? "active" : "revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-ink-500 sm:table-cell">
                      {key.lastRequest ? new Date(key.lastRequest).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell className="hidden text-ink-500 sm:table-cell">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Revoke ${key.name || "key"}`}
                        onClick={() => handleRevoke(key.id)}
                        className="text-ink-500 hover:bg-seal-500/10 hover:text-seal-400"
                      >
                        <Trash2 />
                      </Button>
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
