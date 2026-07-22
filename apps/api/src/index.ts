import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { prisma } from "./db";
import { requireApiKey, requireSession } from "./middleware/auth";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

app.get("/projects", requireSession, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { ownerId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ projects });
});

app.post("/projects", requireSession, async (req, res) => {
  const { name, slug: rawSlug } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const slug = typeof rawSlug === "string" && rawSlug.length > 0 ? rawSlug : slugify(name);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    res.status(400).json({ error: "slug must match ^[a-z0-9-]+$" });
    return;
  }

  try {
    const project = await prisma.project.create({
      data: { name: name.trim(), slug, ownerId: req.user!.id },
    });
    res.status(201).json({ project });
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      res.status(409).json({ error: "slug already in use" });
      return;
    }
    throw err;
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
