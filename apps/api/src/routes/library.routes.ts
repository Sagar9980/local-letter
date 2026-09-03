import { Router } from "express";
import * as libraryController from "../controllers/library.controller";
import { requireSession } from "../middleware/auth";

// Read-only catalogue of the built-in packs, mounted at /library. Importing
// into a project lives on the project router, since it writes project data.
//
// These handlers are synchronous — packs are compiled-in data, not database
// rows — so a thrown NotFoundError reaches the error handler through Express's
// own try/catch and needs no asyncHandler wrapper.
export const libraryRouter = Router();

libraryRouter.use(requireSession);

libraryRouter.get("/packs", libraryController.listPacks);
libraryRouter.get("/packs/:packId", libraryController.getPack);
libraryRouter.get("/packs/:packId/templates/:templateKey", libraryController.getPackTemplate);
