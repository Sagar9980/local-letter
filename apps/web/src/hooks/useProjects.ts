import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import type { Project } from "@/lib/project-context"

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null)

  const refresh = useCallback(async () => {
    const data = await apiFetch<Project[]>("/projects")
    setProjects(data)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { projects, refresh }
}
