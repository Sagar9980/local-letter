import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { errorHandler } from "./middleware/error-handler";
import { router } from "./routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    }),
  );

  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(express.json());

  app.use(router);

  app.use(errorHandler);

  return app;
}

