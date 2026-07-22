import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { requireApiKey, requireSession } from "./middleware/auth";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

// Better Auth handles its own body parsing, so it must be mounted before express.json().
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/me", requireSession, (req, res) => {
  res.json({ user: req.user });
});

app.get("/v1/whoami", requireApiKey, (req, res) => {
  res.json({ referenceId: req.apiKeyReferenceId });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
