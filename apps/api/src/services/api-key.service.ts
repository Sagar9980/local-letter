import { auth } from "../auth";
import { prisma } from "../db";
import { BadRequestError, NotFoundError } from "../lib/errors";
import { getOwnedProject } from "./project.service";

export async function listApiKeys(slug: string, ownerId: string) {
  const project = await getOwnedProject(slug, ownerId);

  return prisma.apiKey.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      start: true,
      prefix: true,
      enabled: true,
      lastRequest: true,
      createdAt: true,
    },
  });
}

export async function createApiKey(slug: string, ownerId: string, name: unknown) {
  const project = await getOwnedProject(slug, ownerId);

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("name is required");
  }

  const created = await auth.api.createApiKey({
    body: { name: name.trim(), userId: ownerId, metadata: { projectId: project.id } },
  });

  // Better Auth's plugin doesn't know about our custom `projectId` column,
  // so it has to be stamped on after the key is created.
  const apiKey = await prisma.apiKey.update({
    where: { id: created.id },
    data: { projectId: project.id },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    start: apiKey.start,
    prefix: apiKey.prefix,
    enabled: apiKey.enabled,
    createdAt: apiKey.createdAt,
    // Raw key is only ever available at creation time.
    key: created.key,
  };
}

export async function revokeApiKey(slug: string, ownerId: string, id: string) {
  const project = await getOwnedProject(slug, ownerId);

  const apiKey = await prisma.apiKey.findFirst({
    where: { id, projectId: project.id },
  });
  if (!apiKey) {
    throw new NotFoundError("API key not found");
  }

  await prisma.apiKey.delete({ where: { id: apiKey.id } });
}
