/**
 * The smallest possible end-to-end check: render one template and send it.
 *
 *   node quickstart.js
 *   node quickstart.js you@example.com          # override TEST_TO
 *
 * Everything else comes from .env — see .env.example.
 */
import { TemplateRenderError, TemplateSendError } from "@local-letter/sdk";
import { createClient, loadConfig } from "./lib/client.js";

const config = loadConfig({ requireRecipient: !process.argv[2] });
const to = process.argv[2] || config.to;
const letters = createClient(config);

console.log(`Rendering "${config.templateKey}" via ${config.baseUrl}`);
console.log(`Sending    ${config.from} -> ${to}\n`);

try {
  const result = await letters.send({
    template: config.templateKey,
    to,
    variables: {
      first_name: "Sagar",
      // Extra keys the template doesn't use are harmless. The reverse isn't
      // symmetrical: a {{token}} you forget to pass is left in place rather
      // than blanked, so it shows up verbatim in the delivered email.
      company: "Local Letter",
    },
    locale: "en",
    fallbackLocale: "en",
  });

  console.log("Sent.");
  console.log(`  resend id : ${result.id}`);
  console.log(`  locale    : ${result.locale}`);
  console.log(`  subject   : ${JSON.stringify(result.subject)}`);
  console.log(`  html      : ${result.html.length} bytes`);
} catch (err) {
  if (err instanceof TemplateRenderError) {
    // The API rejected the render — bad key, unknown template, or no locale.
    console.error(`Render failed (HTTP ${err.status}): ${err.message}`);
  } else if (err instanceof TemplateSendError) {
    // Rendered fine; Resend refused it. Usually an unverified sender domain.
    console.error(`Send failed: ${err.message}`);
  } else {
    // Nothing reached the API — wrong base URL, or it isn't running.
    console.error(`Unexpected error: ${err.message}`);
  }
  process.exit(1);
}
