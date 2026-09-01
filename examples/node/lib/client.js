import dotenv from "dotenv";
import { TemplateClient } from "local-letter";

// Resolved relative to this file rather than process.cwd(), so the example
// still finds its .env when started from the repo root.
dotenv.config({ path: new URL("../.env", import.meta.url) });

/**
 * Reads config from the environment and fails loudly if a credential is
 * missing, so you get a readable message instead of a 401 from somewhere
 * deep inside the SDK.
 */
export function loadConfig({ requireRecipient = false } = {}) {
  const config = {
    baseUrl: process.env.LOCAL_LETTER_BASE_URL || "http://localhost:4000",
    apiKey: process.env.LOCAL_LETTER_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    from: process.env.MAIL_FROM || "onboarding@resend.dev",
    templateKey: process.env.TEMPLATE_KEY || "welcome-email",
    to: process.env.TEST_TO,
  };

  const missing = [];
  if (!config.apiKey) missing.push("LOCAL_LETTER_API_KEY");
  if (!config.resendApiKey) missing.push("RESEND_API_KEY");
  if (requireRecipient && !config.to) missing.push("TEST_TO");

  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    console.error("Copy .env.example to .env and fill it in.");
    process.exit(1);
  }

  return config;
}

/**
 * One client per process. The SDK holds a Resend client internally, so there's
 * no reason to rebuild it per request.
 */
export function createClient(config) {
  return new TemplateClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    resendApiKey: config.resendApiKey,
    from: config.from,
  });
}
