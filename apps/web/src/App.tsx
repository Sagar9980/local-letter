import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { BrandedLoader } from "@/components/BrandedLoader";
import { RequireAuth } from "@/routes/RequireAuth";
import { RedirectIfAuthed } from "@/routes/RedirectIfAuthed";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ProjectsListPage } from "@/pages/ProjectsListPage";
import { ProjectProvider } from "@/components/dashboard/ProjectProvider";
import { ProjectLayout } from "@/components/dashboard/ProjectLayout";
import { ProjectOverviewPage } from "@/pages/ProjectOverviewPage";
import { TemplatesPage } from "@/pages/TemplatesPage";
import { ApiKeysPage } from "@/pages/ApiKeysPage";
import { TooltipProvider } from "@/components/ui/tooltip";

// GrapesJS is heavy (~2MB); keep it out of the main bundle and load on demand.
const TemplateEditorPage = lazy(() =>
  import("@/pages/TemplateEditorPage").then((m) => ({
    default: m.TemplateEditorPage,
  })),
);

function EditorFallback() {
  return <BrandedLoader label="Loading the editor" />;
}

function RootRedirect() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <BrandedLoader />;
  }

  return <Navigate to={session ? "/projects" : "/login"} replace />;
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
        element: <ProjectProvider />,
        children: [
          {
            element: <ProjectLayout />,
            children: [
              { index: true, element: <ProjectOverviewPage /> },
              { path: "templates", element: <TemplatesPage /> },
              { path: "api-keys", element: <ApiKeysPage /> },
            ],
          },
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
]);

function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}

export default App;

