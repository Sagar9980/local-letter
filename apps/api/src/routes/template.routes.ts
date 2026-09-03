import { Router } from "express";
import * as libraryController from "../controllers/library.controller";
import * as templateController from "../controllers/template.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireSession } from "../middleware/auth";

// Mounted with mergeParams under /projects/:slug/templates.
export const templateRouter = Router({ mergeParams: true });

templateRouter.use(requireSession);

templateRouter.get("/", asyncHandler(templateController.listTemplates));
templateRouter.post("/", asyncHandler(templateController.createTemplate));

// Bulk-creates templates from a built-in library pack. Declared before the
// `/:key` routes so it reads as a sibling of the collection, not a template.
templateRouter.post("/import", asyncHandler(libraryController.importPack));

templateRouter.get("/:key", asyncHandler(templateController.getTemplate));
templateRouter.delete("/:key", asyncHandler(templateController.deleteTemplate));

// Saves the default locale; :key/locales/:locale saves a specific one.
templateRouter.put("/:key", asyncHandler(templateController.updateTemplateLocale));

templateRouter.post("/:key/locales", asyncHandler(templateController.createTemplateLocale));
templateRouter.put("/:key/locales/:locale", asyncHandler(templateController.updateTemplateLocale));
templateRouter.delete("/:key/locales/:locale", asyncHandler(templateController.deleteTemplateLocale));
