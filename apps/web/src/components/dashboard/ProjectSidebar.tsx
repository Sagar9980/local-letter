import {
  ArrowUpRight,
  Check,
  ChevronsUpDown,
  FolderKanban,
  KeySquare,
  LayoutTemplate,
  Library,
  Plus,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCurrentProject } from "@/lib/project-context";
import { useProjects } from "@/hooks/useProjects";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/Logo";
import { UserMenu } from "@/components/UserMenu";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Overview", segment: "", icon: FolderKanban, disabled: false },
  {
    label: "Templates",
    segment: "templates",
    icon: LayoutTemplate,
    disabled: false,
  },
  { label: "Library", segment: "library", icon: Library, disabled: false },
  { label: "API Keys", segment: "api-keys", icon: KeySquare, disabled: false },
];

function projectInitial(name: string) {
  return name.slice(0, 1).toUpperCase() || "?";
}

export function ProjectSidebar() {
  const navigate = useNavigate();
  const project = useCurrentProject();
  const { projects } = useProjects();
  const { state } = useSidebar();
  const { pathname } = useLocation();

  // /projects/:slug/<segment> — "" is the overview.
  const currentSegment = pathname.split("/")[3] ?? "";

  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-ink-50/8">
      <SidebarHeader className="gap-3">
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-opacity hover:opacity-85",
            collapsed && "justify-center px-0",
          )}
        >
          <LogoMark className="size-6 shrink-0" />
          {!collapsed && (
            <span className="text-[0.9rem] font-medium tracking-[-0.02em] text-ink-50">
              Local Letter
            </span>
          )}
        </button>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={project.name}
                  className="rounded-xl bg-ink-50/4 ring-1 ring-ink-50/8 hover:bg-ink-50/8"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-ember-300 to-ember-500 text-sm font-medium text-ember-ink">
                    {projectInitial(project.name)}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium text-ink-50">
                      {project.name}
                    </span>
                    <span className="truncate font-mono text-[0.6875rem] text-ink-500">
                      {project.slug}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-ink-500" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl"
                side="bottom"
                align="start"
                sideOffset={6}
              >
                <DropdownMenuLabel className="text-[0.6875rem] tracking-wide text-ink-500 uppercase">
                  Switch project
                </DropdownMenuLabel>
                {(projects ?? []).map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onSelect={() => navigate(`/projects/${p.slug}`)}
                    className="gap-2.5"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded bg-ink-50/8 text-[10px] font-medium text-ink-100">
                      {projectInitial(p.name)}
                    </div>
                    <span className="flex-1 truncate">{p.name}</span>
                    {p.id === project.id && (
                      <Check className="size-3.5 text-ember-300" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/projects")}>
                  <Plus />
                  All projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.6875rem] tracking-[0.12em] text-ink-700 uppercase">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentSegment === item.segment;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "relative text-ink-300 transition-colors hover:bg-ink-50/6 hover:text-ink-50",
                        // The ember rail is the only "you are here" cue that
                        // survives the icon-only collapsed state.
                        isActive &&
                          "bg-ember-400/10 font-medium text-ink-50 before:absolute before:top-1.5 before:bottom-1.5 before:-left-2 before:w-0.5 before:rounded-full before:bg-ember-400 data-active:bg-ember-400/10 data-active:text-ink-50 [&>svg]:text-ember-300",
                      )}
                    >
                      <Link
                        to={`/projects/${project.slug}${item.segment ? `/${item.segment}` : ""}`}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.6875rem] tracking-[0.12em] text-ink-700 uppercase">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="GitHub"
                  className="text-ink-300"
                >
                  <a href={site.githubUrl} target="_blank" rel="noreferrer">
                    <ArrowUpRight />
                    <span>GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                <SidebarMenuButton
                  size="lg"
                  className="rounded-xl hover:bg-ink-50/6"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-ink-50/8 text-xs font-medium text-ink-100">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium text-ink-100">
                      {name || "Account"}
                    </span>
                    <span className="truncate text-[0.6875rem] text-ink-500">
                      {email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-ink-500" />
                </SidebarMenuButton>
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

