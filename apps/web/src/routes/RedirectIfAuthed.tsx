import { Navigate, Outlet } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { BrandedLoader } from "@/components/BrandedLoader"

export function RedirectIfAuthed() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <BrandedLoader label="Checking your session" />
  }

  if (session) {
    return <Navigate to="/projects" replace />
  }

  return <Outlet />
}
