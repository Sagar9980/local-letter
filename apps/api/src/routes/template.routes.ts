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

// Saves the default locale; :key/locales/:locale saves a specific one.
templateRouter.put("/:key", asyncHandler(templateController.updateTemplateLocale));

templateRouter.post("/:key/locales", asyncHandler(templateController.createTemplateLocale));
templateRouter.put("/:key/locales/:locale", asyncHandler(templateController.updateTemplateLocale));
templateRouter.delete("/:key/locales/:locale", asyncHandler(templateController.deleteTemplateLocale));
