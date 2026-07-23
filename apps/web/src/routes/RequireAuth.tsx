import { Loader2 } from "lucide-react"
import { Navigate, Outlet } from "react-router-dom"
import { useSession } from "@/lib/auth-client"

export function RequireAuth() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
