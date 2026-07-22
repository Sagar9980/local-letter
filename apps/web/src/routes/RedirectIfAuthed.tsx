import { Navigate, Outlet } from "react-router-dom"
import { useSession } from "@/lib/auth-client"

export function RedirectIfAuthed() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard/projects" replace />
  }

  return <Outlet />
}
