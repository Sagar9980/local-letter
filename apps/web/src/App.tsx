import { lazy, Suspense } from "react"
import { Loader2 } from "lucide-react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { RequireAuth } from "@/routes/RequireAuth"
import { RedirectIfAuthed } from "@/routes/RedirectIfAuthed"
import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"
import { ProjectsListPage } from "@/pages/ProjectsListPage"
import { ProjectLayout } from "@/components/dashboard/ProjectLayout"
import { ProjectOverviewPage } from "@/pages/ProjectOverviewPage"
import { TemplatesPage } from "@/pages/TemplatesPage"
import { TooltipProvider } from "@/components/ui/tooltip"

// GrapesJS is heavy (~2MB); keep it out of the main bundle and load on demand.
const TemplateEditorPage = lazy(() =>
  import("@/pages/TemplateEditorPage").then((m) => ({ default: m.TemplateEditorPage })),
)

function EditorFallback() {
  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  )
}

function RootRedirect() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <Navigate to={session ? "/projects" : "/login"} replace />
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
    element: <RequireAuth />,
    children: [
      { path: "/projects", element: <ProjectsListPage /> },
      {
        path: "/projects/:slug",
        element: <ProjectLayout />,
        children: [
          { index: true, element: <ProjectOverviewPage /> },
          { path: "templates", element: <TemplatesPage /> },
          {
            path: "templates/:key",
            element: (
              <Suspense fallback={<EditorFallback />}>
                <TemplateEditorPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
])

function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}

export default App
