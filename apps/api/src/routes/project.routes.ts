import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireSession } from "../middleware/auth";
import { apiKeyRouter } from "./api-key.routes";
import { templateRouter } from "./template.routes";

export const projectRouter = Router();

projectRouter.use(requireSession);

projectRouter.get("/", asyncHandler(projectController.listProjects));
projectRouter.post("/", asyncHandler(projectController.createProject));
projectRouter.get("/:slug", asyncHandler(projectController.getProject));

projectRouter.use("/:slug/templates", templateRouter);
projectRouter.use("/:slug/api-keys", apiKeyRouter);
