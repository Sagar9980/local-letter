import type { Request, Response } from "express";
import { ApiResponse } from "../lib/api-response";
import { buildPaginationMeta, parsePagination } from "../lib/pagination";
import * as templateService from "../services/template.service";

export async function listTemplates(req: Request, res: Response) {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const pagination = parsePagination(req.query);

  const { items, total } = await templateService.listTemplates(
    String(req.params.slug),
    req.user!.id,
    { q, status },
    pagination,
  );

  ApiResponse.success(res, items, {
    message: "Templates fetched successfully",
    pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
  });
}

export async function createTemplate(req: Request, res: Response) {
  const { name, key } = req.body ?? {};
  const template = await templateService.createTemplate(
    String(req.params.slug),
    req.user!.id,
    name,
    key,
  );
  ApiResponse.success(res, template, { message: "Template created successfully", statusCode: 201 });
}

export async function getTemplate(req: Request, res: Response) {
  const template = await templateService.getTemplate(
    String(req.params.slug),
    req.user!.id,
    String(req.params.key),
  );
  ApiResponse.success(res, template, { message: "Template fetched successfully" });
}

export async function updateTemplateLocale(req: Request, res: Response) {
  const { subject, htmlBody, designJson } = req.body ?? {};
  const locale = await templateService.updateTemplateLocale(
    String(req.params.slug),
    req.user!.id,
    String(req.params.key),
    // Omitted on the template-level route, which always saves the default locale.
    req.params.locale,
    subject,
    htmlBody,
    designJson,
  );
  ApiResponse.success(res, locale, { message: "Template saved successfully" });
}

export async function createTemplateLocale(req: Request, res: Response) {
  const { locale, copyFrom } = req.body ?? {};
  const created = await templateService.createTemplateLocale(
    String(req.params.slug),
    req.user!.id,
    String(req.params.key),
    locale,
    copyFrom,
  );
  ApiResponse.success(res, created, { message: "Locale added successfully", statusCode: 201 });
}

export async function deleteTemplateLocale(req: Request, res: Response) {
  const deleted = await templateService.deleteTemplateLocale(
    String(req.params.slug),
    req.user!.id,
    String(req.params.key),
    req.params.locale,
  );
  ApiResponse.success(res, deleted, { message: "Locale deleted successfully" });
}
