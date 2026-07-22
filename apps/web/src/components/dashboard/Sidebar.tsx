import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const links = [
  { label: "Projects", to: "/dashboard/projects", disabled: false },
  { label: "Templates", to: "/dashboard/templates", disabled: true },
  { label: "API Keys", to: "/dashboard/api-keys", disabled: true },
]

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r bg-background p-4">
      <p className="mb-2 px-2 text-lg font-semibold">Local Letter</p>
      {links.map((link) =>
        link.disabled ? (
          <span
            key={link.label}
            className="cursor-not-allowed rounded-md px-2 py-1.5 text-sm text-muted-foreground/50"
          >
            {link.label}
          </span>
        ) : (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                isActive && "bg-accent font-medium",
              )
            }
          >
            {link.label}
          </NavLink>
        ),
      )}
    </aside>
  )
}
