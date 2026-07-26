import { Router } from "express";
import * as miscController from "../controllers/misc.controller";
import * as renderController from "../controllers/render.controller";
import { asyncHandler } from "../lib/async-handler";
import { requireApiKey } from "../middleware/auth";

// SDK-facing routes, authenticated via `Authorization: Bearer <project api key>`.
export const v1Router = Router();

v1Router.use(requireApiKey);

v1Router.get("/whoami", miscController.whoami);
v1Router.post("/render/:key", asyncHandler(renderController.renderTemplate));
