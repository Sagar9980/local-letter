import { useState } from "react"
import { Check, ChevronRight, Copy } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { ProjectSidebar } from "@/components/dashboard/ProjectSidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const sectionLabels: Record<string, string> = {
  templates: "Templates",
  "api-keys": "API keys",
}

export function ProjectLayout() {
  const project = useCurrentProject()
  const { pathname } = useLocation()
  const [copied, setCopied] = useState(false)

  // /projects/:slug/<section> — anything past the slug names the current page.
  const segment = pathname.split("/")[3] ?? ""
  const section = sectionLabels[segment] ?? "Overview"

  async function copySlug() {
    await navigator.clipboard.writeText(project.slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SidebarProvider>
      <ProjectSidebar />
      <SidebarInset className="bg-ink-950">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-ink-50/8 bg-ink-950/70 px-4 backdrop-blur-xl">
          <SidebarTrigger className="-ml-1 text-ink-300 hover:text-ink-50" />
          <Separator orientation="vertical" className="mr-1 h-4 bg-ink-50/10" />

          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link
              to="/projects"
              className="hidden text-ink-500 transition-colors hover:text-ink-100 sm:inline"
            >
              Projects
            </Link>
            <ChevronRight className="hidden size-3.5 text-ink-700 sm:inline" />
            <span className="truncate text-ink-300">{project.name}</span>
            <ChevronRight className="size-3.5 shrink-0 text-ink-700" />
            <span className="truncate font-medium text-ink-50">{section}</span>
          </nav>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={copySlug}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink-50/4 px-2.5 py-1 font-mono text-[0.6875rem] text-ink-300 ring-1 ring-ink-50/8 transition-colors hover:bg-ink-50/8 hover:text-ink-50"
              >
                {project.slug}
                {copied ? (
                  <Check className="size-3 text-ember-300" />
                ) : (
                  <Copy className="size-3 opacity-60" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy project slug</TooltipContent>
          </Tooltip>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
