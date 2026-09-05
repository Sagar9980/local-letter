import { Resend } from "resend";

export interface TemplateClientOptions {
  /** Base URL of your local-letter API, e.g. https://letters.yourcompany.com */
  baseUrl: string;
  /** Project API key, generated from the local-letter dashboard's API Keys page. */
  apiKey: string;
  /** Resend API key. Never sent to local-letter — used only to call Resend directly. */
  resendApiKey: string;
  /** Default "from" address used for every send() call unless overridden. */
  from: string;
}

export interface SendOptions {
  /** Template key, e.g. "welcome-email". */
  template: string;
  to: string | string[];
  variables?: Record<string, unknown>;
  locale?: string;
  fallbackLocale?: string;
  /** Overrides the client's default `from` for this send only. */
  from?: string;
  replyTo?: string;
}

export interface SendResult {
  id: string;
  subject: string;
  html: string;
  locale: string;
}

export class TemplateRenderError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "TemplateRenderError";
  }
}

export class TemplateSendError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "TemplateSendError";
  }
}

interface RenderResponse {
  subject: string;
  html: string;
  locale: string;
}

// local-letter's API wraps every response in a { success, message, data }
// envelope; unwrap it here so the rest of the SDK deals in plain payloads.
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export class TemplateClient {
  private readonly resend: Resend;

  constructor(private readonly options: TemplateClientOptions) {
    this.resend = new Resend(options.resendApiKey);
  }

  private async render(
    template: string,
    opts: Pick<SendOptions, "variables" | "locale" | "fallbackLocale">,
  ): Promise<RenderResponse> {
    const res = await fetch(`${this.options.baseUrl}/v1/render/${template}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.options.apiKey}`,
      },
      body: JSON.stringify({
        variables: opts.variables ?? {},
        locale: opts.locale,
        fallbackLocale: opts.fallbackLocale,
      }),
    });

    const body = (await res.json().catch(() => null)) as ApiEnvelope<RenderResponse> | null;

    if (!res.ok || !body || !body.success) {
      throw new TemplateRenderError(body?.message ?? "Failed to render template", res.status);
    }

    return body.data;
  }

  /**
   * Renders `template` with `variables` and sends it via Resend in one call.
   */
  async send(opts: SendOptions): Promise<SendResult> {
    const rendered = await this.render(opts.template, {
      variables: opts.variables,
      locale: opts.locale,
      fallbackLocale: opts.fallbackLocale,
    });

    const { data, error } = await this.resend.emails.send({
      from: opts.from ?? this.options.from,
      to: opts.to,
      subject: rendered.subject,
      html: rendered.html,
      replyTo: opts.replyTo,
    });

    if (error || !data) {
      throw new TemplateSendError(error?.message ?? "Resend failed to send the email", error);
    }

    return {
      id: data.id,
      subject: rendered.subject,
      html: rendered.html,
      locale: rendered.locale,
    };
  }
}
