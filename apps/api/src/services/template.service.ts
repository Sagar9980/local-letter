import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { BadRequestError, ConflictError, NotFoundError, isUniqueConstraintError } from "../lib/errors";
import { LOCALE_PATTERN, normalizeLocale } from "../lib/locale";
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
        locales: sortLocales(
          template.locales.map((l) => l.locale),
          template.defaultLocale,
        ),
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
  const template = await getOwnedTemplate(slug, ownerId, key);
  return {
    ...template,
    locales: [...template.locales].sort((a, b) =>
      compareLocales(a.locale, b.locale, template.defaultLocale),
    ),
  };
}

export async function updateTemplateLocale(
  slug: string,
  ownerId: string,
  key: string,
  rawLocale: unknown,
  subject: unknown,
  htmlBody: unknown,
  designJson: unknown,
) {
  const template = await getOwnedTemplate(slug, ownerId, key);
  const locale = rawLocale === undefined ? template.defaultLocale : parseLocale(rawLocale);

  if (typeof subject !== "string" || typeof htmlBody !== "string") {
    throw new BadRequestError("subject and htmlBody are required strings");
  }

  const design = designJson as Prisma.InputJsonValue | undefined;

  return prisma.templateLocale.upsert({
    where: { templateId_locale: { templateId: template.id, locale } },
    update: { subject, htmlBody, designJson: design },
    create: {
      templateId: template.id,
      locale,
      subject,
      htmlBody,
      designJson: design,
      status: "draft",
    },
  });
}

// Adds a translation slot to an existing template. `rawCopyFrom` seeds the new
// locale from a sibling's design so translators start from the built layout
// instead of a blank canvas; omit it for an empty locale.
export async function createTemplateLocale(
  slug: string,
  ownerId: string,
  key: string,
  rawLocale: unknown,
  rawCopyFrom: unknown,
) {
  const template = await getOwnedTemplate(slug, ownerId, key);
  const locale = parseLocale(rawLocale);

  if (template.locales.some((l) => l.locale === locale)) {
    throw new ConflictError("locale already exists for this template");
  }

  let source: (typeof template.locales)[number] | undefined;
  if (rawCopyFrom !== undefined && rawCopyFrom !== null && rawCopyFrom !== "") {
    const copyFrom = parseLocale(rawCopyFrom);
    source = template.locales.find((l) => l.locale === copyFrom);
    if (!source) {
      throw new BadRequestError(`Cannot copy from ${copyFrom}: locale not found on this template`);
    }
  }

  return prisma.templateLocale.create({
    data: {
      templateId: template.id,
      locale,
      subject: source?.subject ?? "",
      htmlBody: source?.htmlBody ?? "",
      designJson: (source?.designJson as Prisma.InputJsonValue | undefined) ?? undefined,
      variablesSchema: (source?.variablesSchema as Prisma.InputJsonValue | undefined) ?? undefined,
      status: "draft",
    },
  });
}

export async function deleteTemplateLocale(
  slug: string,
  ownerId: string,
  key: string,
  rawLocale: unknown,
) {
  const template = await getOwnedTemplate(slug, ownerId, key);
  const locale = parseLocale(rawLocale);

  // The default locale is the render fallback of last resort — removing it
  // would leave the template unrenderable for any unmatched locale.
  if (locale === template.defaultLocale) {
    throw new BadRequestError("Cannot delete the default locale");
  }

  const existing = await prisma.templateLocale.findUnique({
    where: { templateId_locale: { templateId: template.id, locale } },
  });
  if (!existing) {
    throw new NotFoundError("Locale not found");
  }

  await prisma.templateLocale.delete({ where: { id: existing.id } });
  return { id: existing.id, locale };
}

async function getOwnedTemplate(slug: string, ownerId: string, key: string) {
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

function parseLocale(value: unknown): string {
  if (typeof value !== "string" || !LOCALE_PATTERN.test(value.trim())) {
    throw new BadRequestError("locale must be a code like 'en' or 'en-US'");
  }
  return normalizeLocale(value);
}

// Default locale first, then alphabetical — the order the editor's tabs use.
function sortLocales(locales: string[], defaultLocale: string): string[] {
  return [...locales].sort((a, b) => compareLocales(a, b, defaultLocale));
}

function compareLocales(a: string, b: string, defaultLocale: string): number {
  if (a === defaultLocale) return -1;
  if (b === defaultLocale) return 1;
  return a.localeCompare(b);
}
