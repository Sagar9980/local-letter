# local-letter

Render an email template from your [local-letter](https://github.com/Sagar9980/local-letter)
project and send it through [Resend](https://resend.com) — in one call.

Your templates and their translations live in the local-letter dashboard, so
copy changes ship without a deploy. Your Resend key never leaves your server:
the SDK renders against your API, then talks to Resend directly.

```bash
npm install local-letter
```

Requires Node 18+.

## Usage

```ts
import { TemplateClient } from "local-letter";

const letters = new TemplateClient({
  baseUrl: "https://letters.yourcompany.com",
  apiKey: process.env.LOCAL_LETTER_API_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  from: "hello@yourcompany.com",
});

const result = await letters.send({
  template: "welcome-email",
  to: "customer@example.com",
  variables: { first_name: "Sagar" },
});

console.log(result.id); // Resend message id
```

`variables` fill `{{token}}` placeholders in the template's subject and body. A
token you don't supply is left in place rather than blanked, so a missing
variable shows up in the output instead of vanishing silently.

### Localisation

Pass the recipient's locale and a fallback. The API normalises casing, so
`en-us` and `EN-US` both match `en-US`:

```ts
await letters.send({
  template: "welcome-email",
  to: user.email,
  variables: { first_name: user.firstName },
  locale: user.locale,      // "fr" — uses the French version if it exists
  fallbackLocale: "en",     // otherwise English, then the template default
});
```

`result.locale` tells you which version actually went out.

## API

### `new TemplateClient(options)`

| Option         | Type     | Notes                                                        |
| -------------- | -------- | ------------------------------------------------------------ |
| `baseUrl`      | `string` | Your local-letter API, e.g. `https://letters.yourcompany.com`. |
| `apiKey`       | `string` | Project API key, from the dashboard's API Keys page.          |
| `resendApiKey` | `string` | Sent only to Resend. local-letter never receives it.          |
| `from`         | `string` | Default sender for every `send()`.                            |

### `letters.send(options)`

| Option           | Type                   | Notes                                    |
| ---------------- | ---------------------- | ---------------------------------------- |
| `template`       | `string`               | Template key, e.g. `"welcome-email"`.     |
| `to`             | `string \| string[]`   | One or more recipients.                   |
| `variables`      | `object`               | Values for the template's `{{tokens}}`.   |
| `locale`         | `string`               | Preferred locale.                         |
| `fallbackLocale` | `string`               | Used when `locale` has no translation.    |
| `from`           | `string`               | Overrides the client default, this send only. |
| `replyTo`        | `string`               | Reply-to address.                         |

Resolves to `{ id, subject, html, locale }` — the Resend message id plus what
was actually rendered.

## Errors

Both error types are exported, so you can tell a template problem from a
delivery problem:

```ts
import { TemplateRenderError, TemplateSendError } from "local-letter";

try {
  await letters.send({ template: "welcome-email", to: user.email });
} catch (err) {
  if (err instanceof TemplateRenderError) {
    // Your API rejected the render. err.status: 401 bad key, 404 no such
    // template, 403 key not linked to a project.
  } else if (err instanceof TemplateSendError) {
    // Rendered fine, Resend refused it — often an unverified sender domain.
    // err.cause holds Resend's own error.
  }
}
```

## Examples

Runnable integrations, including an Express app, live in
[`examples/`](https://github.com/Sagar9980/local-letter/tree/main/examples).

## License

MIT
