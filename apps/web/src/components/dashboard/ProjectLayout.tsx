import { Outlet } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { ProjectSidebar } from "@/components/dashboard/ProjectSidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function ProjectLayout() {
  const project = useCurrentProject()

  return (
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
  )
}
