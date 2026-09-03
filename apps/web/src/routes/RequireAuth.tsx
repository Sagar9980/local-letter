import { Navigate, Outlet } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { BrandedLoader } from "@/components/BrandedLoader"

export function RequireAuth() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <BrandedLoader label="Checking your session" />
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
