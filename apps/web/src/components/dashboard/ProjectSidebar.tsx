import { ChevronsUpDown, FolderKanban, KeySquare, LayoutTemplate, Library } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useCurrentProject } from "@/lib/project-context"
import { useProjects } from "@/hooks/useProjects"
import { UserMenu } from "@/components/UserMenu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { label: "Overview", segment: "", icon: FolderKanban, disabled: false },
  { label: "Templates", segment: "templates", icon: LayoutTemplate, disabled: false },
  { label: "Library", segment: "library", icon: Library, disabled: false },
  { label: "API Keys", segment: "api-keys", icon: KeySquare, disabled: false },
]

function projectInitial(name: string) {
  return name.slice(0, 1).toUpperCase() || "?"
}

export function ProjectSidebar() {
  const navigate = useNavigate()
  const project = useCurrentProject()
  const { projects } = useProjects()

  const otherProjects = (projects ?? []).filter((p) => p.id !== project.id)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                    {projectInitial(project.name)}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{project.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{project.slug}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                side="bottom"
                align="start"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Switch project
                </DropdownMenuLabel>
                {otherProjects.map((p) => (
                  <DropdownMenuItem key={p.id} onSelect={() => navigate(`/projects/${p.slug}`)}>
                    <div className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium">
                      {projectInitial(p.name)}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/projects")}>
                  <FolderKanban />
                  All projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  {item.disabled ? (
                    <SidebarMenuButton disabled tooltip={`${item.label} (coming soon)`}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink
                        to={`/projects/${project.slug}${item.segment ? `/${item.segment}` : ""}`}
                        end={item.segment === ""}
                        className={({ isActive }) => (isActive ? "bg-sidebar-accent font-medium" : "")}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu
              side="top"
              trigger={({ name, email, initials }) => (
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-xs font-medium">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name || "Account"}</span>
                    <span className="truncate text-xs text-muted-foreground">{email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
