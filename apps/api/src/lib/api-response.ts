import type { Response } from "express";

// Consistent response envelope for every endpoint, in the spirit of the
// JSend / Google JSON style guide conventions: a `success` discriminator,
// a machine-checkable `statusCode`, a human-readable `message`, and the
// actual payload under `data`. List endpoints additionally attach
// `meta.pagination`.
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessBody<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string;
  errors?: unknown;
}

export const ApiResponse = {
  success<T>(
    res: Response,
    data: T,
    options: { message?: string; statusCode?: number; pagination?: PaginationMeta } = {},
  ) {
    const { message = "Success", statusCode = 200, pagination } = options;
    const body: ApiSuccessBody<T> = {
      success: true,
      statusCode,
      message,
      data,
      ...(pagination ? { meta: { pagination } } : {}),
    };
    return res.status(statusCode).json(body);
  },

  error(res: Response, message: string, statusCode = 500, errors?: unknown) {
    const body: ApiErrorBody = {
      success: false,
      statusCode,
      message,
      ...(errors !== undefined ? { errors } : {}),
    };
    return res.status(statusCode).json(body);
  },
};
