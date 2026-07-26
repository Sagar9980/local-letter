import { Router } from "express";
import * as apiKeyController from "../controllers/api-key.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireSession } from "../middleware/auth";

// Mounted with mergeParams under /projects/:slug/api-keys.
export const apiKeyRouter = Router({ mergeParams: true });

apiKeyRouter.use(requireSession);

apiKeyRouter.get("/", asyncHandler(apiKeyController.listApiKeys));
apiKeyRouter.post("/", asyncHandler(apiKeyController.createApiKey));
apiKeyRouter.delete("/:id", asyncHandler(apiKeyController.revokeApiKey));
