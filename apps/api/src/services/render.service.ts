import { prisma } from "../db";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { LOCALE_PATTERN, normalizeLocale } from "../lib/locale";
import { interpolate } from "../utils/interpolate";

export type RenderOptions = {
  variables?: unknown;
  locale?: unknown;
  fallbackLocale?: unknown;
};

export async function renderTemplate(projectId: string | undefined, key: string, opts: RenderOptions) {
  if (!projectId) {
    throw new ForbiddenError("API key is not linked to a project");
  }

  const template = await prisma.template.findFirst({
    where: { projectId, key },
    include: { locales: true },
  });
  if (!template) {
    throw new NotFoundError("Template not found");
  }

  const variables: Record<string, unknown> =
    typeof opts.variables === "object" && opts.variables ? (opts.variables as Record<string, unknown>) : {};

  // Requested codes are normalised ("EN-us" -> "en-US") so casing differences
  // between the host app and the dashboard don't silently miss a translation.
  const requested = toLocaleCode(opts.locale);
  const fallback = toLocaleCode(opts.fallbackLocale);

  const locale =
    template.locales.find((l) => l.locale === requested) ??
    template.locales.find((l) => l.locale === fallback) ??
    template.locales.find((l) => l.locale === template.defaultLocale);

  if (!locale) {
    throw new NotFoundError("No locale available for this template");
  }

  return {
    subject: interpolate(locale.subject, variables),
    html: interpolate(locale.htmlBody, variables),
    locale: locale.locale,
  };
}

function toLocaleCode(value: unknown): string | undefined {
  if (typeof value !== "string" || !LOCALE_PATTERN.test(value.trim())) return undefined;
  return normalizeLocale(value);
}
