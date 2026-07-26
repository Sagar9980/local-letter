import type { Request, Response } from "express";
import { ApiResponse } from "../lib/api-response";
import { buildPaginationMeta, parsePagination } from "../lib/pagination";
import * as projectService from "../services/project.service";

export async function listProjects(req: Request, res: Response) {
  const pagination = parsePagination(req.query);
  const { items, total } = await projectService.listProjects(req.user!.id, pagination);
  ApiResponse.success(res, items, {
    message: "Projects fetched successfully",
    pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
  });
}

export async function getProject(req: Request, res: Response) {
  const project = await projectService.getOwnedProject(String(req.params.slug), req.user!.id);
  ApiResponse.success(res, project, { message: "Project fetched successfully" });
}

export async function createProject(req: Request, res: Response) {
  const { name, slug } = req.body ?? {};
  const project = await projectService.createProject(req.user!.id, name, slug);
  ApiResponse.success(res, project, { message: "Project created successfully", statusCode: 201 });
}
