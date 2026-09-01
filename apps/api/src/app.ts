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

  // A saved template carries both the inlined HTML and the editor's full
  // designJson, which together already run to ~95% of body-parser's 100kb
  // default. One more image block would start failing saves with an opaque 413.
  app.use(express.json({ limit: "5mb" }));

  app.use(router);

  app.use(errorHandler);

  return app;
}

