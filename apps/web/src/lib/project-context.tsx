import { createContext, useContext } from "react"

export type Project = {
  id: string
  name: string
  slug: string
  createdAt: string
}

type ProjectContextValue = {
  project: Project
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectContextProvider({
  project,
  children,
}: {
  project: Project
  children: React.ReactNode
}) {
  return <ProjectContext.Provider value={{ project }}>{children}</ProjectContext.Provider>
}

export function useCurrentProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) {
    throw new Error("useCurrentProject must be used within a ProjectLayout")
  }
  return ctx.project
}
