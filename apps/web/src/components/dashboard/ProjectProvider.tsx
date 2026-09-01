import { useEffect, useState } from "react"
import { Navigate, Outlet, useParams } from "react-router-dom"
import { apiFetch } from "@/lib/api"
import { ProjectContextProvider, type Project } from "@/lib/project-context"
import { BrandedLoader } from "@/components/BrandedLoader"

export function ProjectProvider() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setProject(null)
    setNotFound(false)

    apiFetch<Project>(`/projects/${slug}`)
      .then((data) => {
        if (!cancelled) setProject(data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (notFound) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <BrandedLoader label="Opening project" />
  }

  return (
    <ProjectContextProvider project={project}>
      <Outlet />
    </ProjectContextProvider>
  )
}
