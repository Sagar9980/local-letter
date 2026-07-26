import { prisma } from "../db";
import { BadRequestError, ConflictError, NotFoundError, isUniqueConstraintError } from "../lib/errors";
import type { PaginationParams } from "../lib/pagination";
import { SLUG_PATTERN, slugify } from "../lib/slugify";

export async function listProjects(ownerId: string, pagination: PaginationParams) {
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.project.count({ where: { ownerId } }),
  ]);
  return { items, total };
}

export async function getOwnedProject(slug: string, ownerId: string) {
  const project = await prisma.project.findFirst({ where: { slug, ownerId } });
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return project;
}

export async function createProject(ownerId: string, name: unknown, rawSlug: unknown) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("name is required");
  }

  const slug = typeof rawSlug === "string" && rawSlug.length > 0 ? rawSlug : slugify(name);
  if (!SLUG_PATTERN.test(slug)) {
    throw new BadRequestError("slug must match ^[a-z0-9-]+$");
  }

  try {
    return await prisma.project.create({
      data: { name: name.trim(), slug, ownerId },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictError("slug already in use");
    }
    throw err;
  }
}
