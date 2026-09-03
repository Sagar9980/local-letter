import { Router } from "express";
import * as miscController from "../controllers/misc.controller";
import { requireSession } from "../middleware/auth";
import { libraryRouter } from "./library.routes";
import { projectRouter } from "./project.routes";
import { v1Router } from "./v1.routes";

export const router = Router();

router.get("/health", miscController.health);
router.get("/me", requireSession, miscController.me);

router.use("/library", libraryRouter);
router.use("/projects", projectRouter);
router.use("/v1", v1Router);
