/**
 * A realistic Express integration: the app owns its own signup flow, and
 * local-letter is just the thing it calls to get an email out.
 *
 *   node server.js          (or: npm run dev, for --watch)
 *
 *   curl -X POST localhost:3000/signup \
 *     -H 'content-type: application/json' \
 *     -d '{"email":"you@example.com","name":"Sagar"}'
 */
import express from "express";
import { TemplateRenderError, TemplateSendError } from "local-letter";
import { createClient, loadConfig } from "./lib/client.js";

const config = loadConfig();
const letters = createClient(config);

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, baseUrl: config.baseUrl, from: config.from });
});

/**
 * The realistic case: a signup handler that emails a new user. Note that the
 * send is awaited here so failures surface in the response — in production
 * you'd more likely queue it and let signup succeed regardless.
 */
app.post("/signup", async (req, res, next) => {
  const { email, name } = req.body ?? {};
  if (!email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  try {
    const result = await letters.send({
      template: config.templateKey,
      to: email,
      variables: {
        first_name: name || email.split("@")[0],
        company: "Local Letter",
      },
      // Honour the browser's language when the template has a translation for
      // it, and fall back to English when it doesn't.
      locale: req.acceptsLanguages()[0],
      fallbackLocale: "en",
    });

    res.status(201).json({ userId: "usr_demo", emailId: result.id, locale: result.locale });
  } catch (err) {
    next(err);
  }
});

/**
 * A generic passthrough, handy for poking at any template without editing code.
 */
app.post("/emails/send", async (req, res, next) => {
  const { template, to, variables, locale, replyTo } = req.body ?? {};
  if (!template || !to) {
    res.status(400).json({ error: "template and to are required" });
    return;
  }

  try {
    const result = await letters.send({
      template,
      to,
      variables,
      locale,
      fallbackLocale: "en",
      replyTo,
    });
    res.json({ id: result.id, subject: result.subject, locale: result.locale });
  } catch (err) {
    next(err);
  }
});

// Translating the SDK's two error types into HTTP statuses is most of what
// integrating it actually involves.
app.use((err, _req, res, _next) => {
  if (err instanceof TemplateRenderError) {
    // 404 means the template key doesn't exist; 401 means a bad API key.
    // Either way it's our misconfiguration, not the caller's.
    console.error(`render failed (${err.status}): ${err.message}`);
    res.status(err.status === 404 ? 404 : 502).json({ error: err.message });
    return;
  }

  if (err instanceof TemplateSendError) {
    console.error(`resend rejected the message: ${err.message}`);
    res.status(502).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal error" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`example app on http://localhost:${port}`);
  console.log(`  -> local-letter at ${config.baseUrl}`);
});
