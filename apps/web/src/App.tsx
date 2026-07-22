import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { RequireAuth } from "@/routes/RequireAuth"
import { RedirectIfAuthed } from "@/routes/RedirectIfAuthed"
import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ProjectsPage } from "@/pages/ProjectsPage"

function RootRedirect() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <Navigate to={session ? "/dashboard/projects" : "/login"} replace />
}

const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard/projects" replace /> },
          { path: "projects", element: <ProjectsPage /> },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
