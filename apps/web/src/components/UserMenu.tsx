import type { ReactNode } from "react"
import { LogOut, Settings, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authClient, useSession } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function initialsOf(value: string) {
  return value.slice(0, 2).toUpperCase()
}

type UserMenuProps = {
  trigger: (info: { name: string; email: string; initials: string }) => ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}

export function UserMenu({ trigger, side = "bottom", align = "end" }: UserMenuProps) {
  const navigate = useNavigate()
  const { data: session } = useSession()

  async function handleSignOut() {
    await authClient.signOut()
    navigate("/login")
  }

  const name = session?.user.name ?? ""
  const email = session?.user.email ?? ""
  const initials = initialsOf(name || email || "?")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger({ name, email, initials })}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" side={side} align={align}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name || "Account"}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
