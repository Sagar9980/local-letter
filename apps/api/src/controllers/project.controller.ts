import type { Request, Response } from "express";
import * as projectService from "../services/project.service";

export async function listProjects(req: Request, res: Response) {
  const projects = await projectService.listProjects(req.user!.id);
  res.json({ projects });
}

export async function getProject(req: Request, res: Response) {
  const project = await projectService.getOwnedProject(String(req.params.slug), req.user!.id);
  res.json({ project });
}

export async function createProject(req: Request, res: Response) {
  const { name, slug } = req.body ?? {};
  const project = await projectService.createProject(req.user!.id, name, slug);
  res.status(201).json({ project });
}
