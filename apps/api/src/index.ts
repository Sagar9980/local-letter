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

app.get("/projects/:slug", requireSession, async (req, res) => {
  const slug = String(req.params.slug);
  const project = await prisma.project.findFirst({
    where: { slug, ownerId: req.user!.id },
  });

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json({ project });
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

async function getOwnedProject(slug: string, ownerId: string) {
  return prisma.project.findFirst({ where: { slug, ownerId } });
}

app.get("/projects/:slug/templates", requireSession, async (req, res) => {
  const project = await getOwnedProject(String(req.params.slug), req.user!.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;

  const templates = await prisma.template.findMany({
    where: {
      projectId: project.id,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { locales: true },
    orderBy: { updatedAt: "desc" },
  });

  const results = templates
    .map((template) => {
      const defaultLocale = template.locales.find((l) => l.locale === template.defaultLocale);
      return {
        id: template.id,
        key: template.key,
        name: template.name,
        defaultLocale: template.defaultLocale,
        status: defaultLocale?.status ?? "draft",
        subject: defaultLocale?.subject ?? "",
        updatedAt: template.updatedAt,
        createdAt: template.createdAt,
      };
    })
    .filter((template) => !status || template.status === status);

  res.json({ templates: results });
});

app.post("/projects/:slug/templates", requireSession, async (req, res) => {
  const project = await getOwnedProject(String(req.params.slug), req.user!.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const { name, key: rawKey } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const key = typeof rawKey === "string" && rawKey.length > 0 ? rawKey : slugify(name);
  if (!/^[a-z0-9-]+$/.test(key)) {
    res.status(400).json({ error: "key must match ^[a-z0-9-]+$" });
    return;
  }

  try {
    const template = await prisma.template.create({
      data: {
        projectId: project.id,
        name: name.trim(),
        key,
        defaultLocale: "en",
        locales: {
          create: {
            locale: "en",
            subject: "",
            htmlBody: "",
            status: "draft",
          },
        },
      },
      include: { locales: true },
    });
    res.status(201).json({ template });
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      res.status(409).json({ error: "key already in use" });
      return;
    }
    throw err;
  }
});

app.get("/projects/:slug/templates/:key", requireSession, async (req, res) => {
  const project = await getOwnedProject(String(req.params.slug), req.user!.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const template = await prisma.template.findFirst({
    where: { projectId: project.id, key: String(req.params.key) },
    include: { locales: true },
  });

  if (!template) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  res.json({ template });
});

app.put("/projects/:slug/templates/:key", requireSession, async (req, res) => {
  const project = await getOwnedProject(String(req.params.slug), req.user!.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const template = await prisma.template.findFirst({
    where: { projectId: project.id, key: String(req.params.key) },
  });

  if (!template) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  const { subject, htmlBody, designJson } = req.body ?? {};

  if (typeof subject !== "string" || typeof htmlBody !== "string") {
    res.status(400).json({ error: "subject and htmlBody are required strings" });
    return;
  }

  const locale = await prisma.templateLocale.upsert({
    where: { templateId_locale: { templateId: template.id, locale: template.defaultLocale } },
    update: { subject, htmlBody, designJson },
    create: {
      templateId: template.id,
      locale: template.defaultLocale,
      subject,
      htmlBody,
      designJson,
      status: "draft",
    },
  });

  res.json({ locale });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
