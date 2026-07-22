export interface TemplateClientOptions {
  baseUrl: string;
  apiKey: string;
}

export interface RenderOptions {
  locale?: string;
  variables?: Record<string, unknown>;
  fallbackLocale?: string;
}

export interface RenderResult {
  subject: string;
  html: string;
  text?: string;
}

export class TemplateClient {
  constructor(private readonly options: TemplateClientOptions) {}

  async render(_templateKey: string, _opts: RenderOptions = {}): Promise<RenderResult> {
    throw new Error("Not implemented");
  }
}
