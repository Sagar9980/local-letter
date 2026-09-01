import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { ArrowUpRight, ChevronRight, FolderOpen, Plus, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useProjects } from "@/hooks/useProjects"
import { apiFetch } from "@/lib/api"
import { site } from "@/lib/site"
import { slugify } from "@/lib/slugify"
import { HorizonGlow } from "@/components/brand/Glow"
import { Wordmark } from "@/components/brand/Logo"
import { UserMenu } from "@/components/UserMenu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** Projects show as tiles, so each one gets a stable colour-of-its-own from
 *  the brand accents rather than a random hue. */
const tileTints = [
  "from-ember-300/85 to-ember-500/85",
  "from-seal-400/85 to-seal-500/85",
  "from-ember-200/85 to-ember-400/85",
]

function tintFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return tileTints[hash % tileTints.length]
}

function projectInitial(name: string) {
  return name.slice(0, 1).toUpperCase() || "?"
}

export function ProjectsListPage() {
  const navigate = useNavigate()
  const { projects, refresh } = useProjects()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const visible = useMemo(() => {
    if (!projects) return null
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    )
  }, [projects, query])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({ name }),
      })
      setIsDialogOpen(false)
      setName("")
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const newProjectDialog = (
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
          New project
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            A project groups templates, locales and the API keys that render them.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              className="h-10 rounded-xl"
              placeholder="Acme Payments"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
            <p className="text-xs text-ink-500">
              Slug:{" "}
              <span className="font-mono text-ink-300">{name ? slugify(name) : "acme-payments"}</span>
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-9 rounded-full px-4">
              {isSubmitting ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="relative flex min-h-svh flex-col bg-ink-950">
      <HorizonGlow className="h-[36rem]" intensity={0.42} />

      <header className="relative z-10 border-b border-ink-50/8 bg-ink-950/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
          <Wordmark />
          <div className="flex items-center gap-4">
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 text-[0.8125rem] text-ink-300 transition-colors hover:text-ink-50 sm:inline-flex"
            >
              GitHub
              <ArrowUpRight className="size-3.5 opacity-70" />
            </a>
            <UserMenu
              trigger={({ initials }) => (
                <button
                  type="button"
                  aria-label="Account menu"
                  className="rounded-full ring-1 ring-ink-50/12 transition-all hover:ring-ember-400/50"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-ink-850 text-[0.7rem] font-medium text-ink-100">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              )}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ll-eyebrow">Workspace</p>
            <h1 className="mt-2 text-[2rem] leading-none font-medium tracking-[-0.035em] text-ink-50">
              Projects
            </h1>
            <p className="mt-2.5 max-w-md text-[0.9375rem] text-ink-300">
              Every project keeps its own templates, locales and API keys. Open one to start
              editing.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {projects && projects.length > 3 && (
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects"
                  aria-label="Search projects"
                  className="h-9 w-52 rounded-full border-ink-50/10 bg-ink-50/4 pl-8.5 text-sm"
                />
              </div>
            )}
            {newProjectDialog}
          </div>
        </div>

        <div className="ll-rule my-8" />

        {visible === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl bg-ink-50/4" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="ll-panel flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-ember-400/10 ring-1 ring-ember-400/20">
              <FolderOpen className="size-6 text-ember-300" />
            </div>
            <div className="max-w-sm">
              <p className="text-[1.0625rem] font-medium text-ink-50">
                {query ? "No projects match that search" : "No projects yet"}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                {query
                  ? "Try a different name or slug."
                  : "Create your first project to design a template and render it from your app."}
              </p>
            </div>
            {!query && (
              <Button className="h-9 rounded-full px-4" onClick={() => setIsDialogOpen(true)}>
                <Plus />
                New project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/projects/${project.slug}`)}
                className="ll-panel ll-panel-hover group flex flex-col gap-5 rounded-2xl p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`grid size-11 place-items-center rounded-xl bg-linear-to-br ${tintFor(
                      project.slug,
                    )} text-[1.05rem] font-medium text-ember-ink shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35)]`}
                  >
                    {projectInitial(project.name)}
                  </div>
                  <ChevronRight className="size-4 text-ink-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ember-300" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.9375rem] font-medium text-ink-50">
                    {project.name}
                  </p>
                  <p className="mt-1 truncate font-mono text-xs text-ink-500">{project.slug}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[0.6875rem] text-ink-700">
                  <span className="size-1 rounded-full bg-ink-700" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
