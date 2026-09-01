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
      <DropdownMenuContent className="min-w-60 rounded-xl" side={side} align={align} sideOffset={6}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2.5 px-1 py-1.5 text-left">
            <Avatar className="size-9 rounded-xl">
              <AvatarFallback className="rounded-xl bg-linear-to-br from-ember-300 to-ember-500 text-xs font-medium text-ember-ink">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 leading-tight">
              <span className="truncate text-sm font-medium text-ink-50">{name || "Account"}</span>
              <span className="truncate text-[0.6875rem] text-ink-500">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User />
          Profile
          <span className="ml-auto text-[0.625rem] tracking-wide text-ink-700 uppercase">Soon</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings />
          Settings
          <span className="ml-auto text-[0.625rem] tracking-wide text-ink-700 uppercase">Soon</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleSignOut}
          className="text-seal-400 focus:bg-seal-500/10 focus:text-seal-400"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
