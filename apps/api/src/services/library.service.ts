import { prisma } from "../db";
import {
  PACKS,
  getPack,
  getPackTemplate,
  renderLibraryTemplate,
  toPackView,
  variablesSchema,
} from "../library";
import { BadRequestError, NotFoundError } from "../lib/errors";
import { SLUG_PATTERN } from "../lib/slugify";
import { getOwnedProject } from "./project.service";

export function listPacks() {
  // The rendered HTML is ~10kb per template; the browser's pack list only needs
  // names and swatches, so it's dropped here and fetched per pack on demand.
  return PACKS.map((pack) => toPackView(pack, false));
}

export function getPackDetail(packId: string) {
  const pack = getPack(packId);
  if (!pack) {
    throw new NotFoundError("Template pack not found");
  }
  return toPackView(pack);
}

export function getPackTemplateDetail(packId: string, templateKey: string) {
  const pack = getPack(packId);
  if (!pack) {
    throw new NotFoundError("Template pack not found");
  }

  const template = getPackTemplate(pack, templateKey);
  if (!template) {
    throw new NotFoundError("Template not found in this pack");
  }

  return { pack: { id: pack.id, name: pack.name }, ...renderLibraryTemplate(pack, template) };
}

export type ImportOptions = {
  templateKeys?: unknown;
  prefix?: unknown;
};

/**
 * Copies library templates into a project as ordinary draft templates.
 *
 * Templates whose key is already taken are skipped rather than overwritten —
 * an import should never silently replace work someone has edited. Callers who
 * want both can pass a `prefix` to namespace the whole batch.
 */
export async function importPack(
  slug: string,
  ownerId: string,
  packId: unknown,
  options: ImportOptions,
) {
  const project = await getOwnedProject(slug, ownerId);

  if (typeof packId !== "string" || packId.length === 0) {
    throw new BadRequestError("packId is required");
  }

  const pack = getPack(packId);
  if (!pack) {
    throw new NotFoundError("Template pack not found");
  }

  const selected = selectTemplates(pack.templates, options.templateKeys);
  const prefix = parsePrefix(options.prefix);

  const targets = selected.map((template) => {
    const key = prefix ? `${prefix}-${template.key}` : template.key;
    if (!SLUG_PATTERN.test(key)) {
      throw new BadRequestError(`Resulting key "${key}" must match ^[a-z0-9-]+$`);
    }
    return { key, template };
  });

  const existing = await prisma.template.findMany({
    where: { projectId: project.id, key: { in: targets.map((t) => t.key) } },
    select: { key: true },
  });
  const taken = new Set(existing.map((t) => t.key));

  const toCreate = targets.filter((t) => !taken.has(t.key));

  const created = await prisma.$transaction(
    toCreate.map(({ key, template }) => {
      const rendered = renderLibraryTemplate(pack, template);
      return prisma.template.create({
        data: {
          projectId: project.id,
          key,
          name: template.name,
          defaultLocale: "en",
          locales: {
            create: {
              locale: "en",
              subject: rendered.subject,
              htmlBody: rendered.html,
              // No designJson: the editor parses `htmlBody` into components the
              // first time the template is opened, then owns it from there.
              variablesSchema: variablesSchema(rendered.variables),
              status: "draft",
            },
          },
        },
        select: { id: true, key: true, name: true },
      });
    }),
  );

  return {
    packId: pack.id,
    packName: pack.name,
    imported: created,
    skipped: targets
      .filter((t) => taken.has(t.key))
      .map((t) => ({ key: t.key, name: t.template.name, reason: "key already in use" })),
  };
}

function selectTemplates<T extends { key: string }>(templates: T[], raw: unknown): T[] {
  if (raw === undefined || raw === null) return templates;

  if (!Array.isArray(raw) || raw.length === 0) {
    throw new BadRequestError("templateKeys must be a non-empty array of template keys");
  }

  return raw.map((key) => {
    const found = templates.find((template) => template.key === key);
    if (!found) {
      throw new BadRequestError(`Unknown template key "${String(key)}" for this pack`);
    }
    return found;
  });
}

function parsePrefix(raw: unknown): string | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw !== "string" || !SLUG_PATTERN.test(raw)) {
    throw new BadRequestError("prefix must match ^[a-z0-9-]+$");
  }
  return raw;
}
