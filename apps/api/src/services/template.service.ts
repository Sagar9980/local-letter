import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { BadRequestError, ConflictError, NotFoundError, isUniqueConstraintError } from "../lib/errors";
import type { PaginationParams } from "../lib/pagination";
import { SLUG_PATTERN, slugify } from "../lib/slugify";
import { getOwnedProject } from "./project.service";

export type TemplateFilters = {
  q?: string;
  status?: string;
};

export async function listTemplates(
  slug: string,
  ownerId: string,
  filters: TemplateFilters,
  pagination: PaginationParams,
) {
  const project = await getOwnedProject(slug, ownerId);

  const templates = await prisma.template.findMany({
    where: {
      projectId: project.id,
      ...(filters.q ? { name: { contains: filters.q, mode: "insensitive" as const } } : {}),
    },
    include: { locales: true },
    orderBy: { updatedAt: "desc" },
  });

  // `status` lives on the default TemplateLocale, not Template, so it can't
  // be pushed into the Prisma `where` clause above — filter/paginate here.
  const filtered = templates
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
    .filter((template) => !filters.status || template.status === filters.status);

  const items = filtered.slice(pagination.skip, pagination.skip + pagination.take);
  return { items, total: filtered.length };
}

export async function createTemplate(
  slug: string,
  ownerId: string,
  name: unknown,
  rawKey: unknown,
) {
  const project = await getOwnedProject(slug, ownerId);

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("name is required");
  }

  const key = typeof rawKey === "string" && rawKey.length > 0 ? rawKey : slugify(name);
  if (!SLUG_PATTERN.test(key)) {
    throw new BadRequestError("key must match ^[a-z0-9-]+$");
  }

  try {
    return await prisma.template.create({
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
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictError("key already in use");
    }
    throw err;
  }
}

export async function getTemplate(slug: string, ownerId: string, key: string) {
  const project = await getOwnedProject(slug, ownerId);

  const template = await prisma.template.findFirst({
    where: { projectId: project.id, key },
    include: { locales: true },
  });

  if (!template) {
    throw new NotFoundError("Template not found");
  }

  return template;
}

export async function updateTemplateLocale(
  slug: string,
  ownerId: string,
  key: string,
  subject: unknown,
  htmlBody: unknown,
  designJson: unknown,
) {
  const project = await getOwnedProject(slug, ownerId);

  const template = await prisma.template.findFirst({
    where: { projectId: project.id, key },
  });
  if (!template) {
    throw new NotFoundError("Template not found");
  }

  if (typeof subject !== "string" || typeof htmlBody !== "string") {
    throw new BadRequestError("subject and htmlBody are required strings");
  }

  const design = designJson as Prisma.InputJsonValue | undefined;

  return prisma.templateLocale.upsert({
    where: { templateId_locale: { templateId: template.id, locale: template.defaultLocale } },
    update: { subject, htmlBody, designJson: design },
    create: {
      templateId: template.id,
      locale: template.defaultLocale,
      subject,
      htmlBody,
      designJson: design,
      status: "draft",
    },
  });
}
