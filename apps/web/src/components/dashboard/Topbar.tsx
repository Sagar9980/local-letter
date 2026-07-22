import { useNavigate } from "react-router-dom"
import { authClient, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Topbar() {
  const navigate = useNavigate()
  const { data: session } = useSession()

  async function handleSignOut() {
    await authClient.signOut()
    navigate("/login")
  }

  const email = session?.user.email ?? ""

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-3">
      <div />
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{email}</span>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  )
}
