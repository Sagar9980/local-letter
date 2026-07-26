import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Navigate, Outlet, useParams } from "react-router-dom"
import { apiFetch } from "@/lib/api"
import { ProjectContextProvider, type Project } from "@/lib/project-context"
import { ProjectSidebar } from "@/components/dashboard/ProjectSidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function ProjectLayout() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setProject(null)
    setNotFound(false)

    apiFetch<Project>(`/projects/${slug}`)
      .then((data) => {
        if (!cancelled) setProject(data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (notFound) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ProjectContextProvider project={project}>
      <SidebarProvider>
        <ProjectSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p className="text-sm font-medium text-muted-foreground">{project.name}</p>
          </header>
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProjectContextProvider>
  )
}
