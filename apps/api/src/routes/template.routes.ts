import { Router } from "express";
import * as templateController from "../controllers/template.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireSession } from "../middleware/auth";

// Mounted with mergeParams under /projects/:slug/templates.
export const templateRouter = Router({ mergeParams: true });

templateRouter.use(requireSession);

templateRouter.get("/", asyncHandler(templateController.listTemplates));
templateRouter.post("/", asyncHandler(templateController.createTemplate));
templateRouter.get("/:key", asyncHandler(templateController.getTemplate));
templateRouter.put("/:key", asyncHandler(templateController.updateTemplateLocale));
