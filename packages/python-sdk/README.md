# local-letter

Render an email template from your [local-letter](https://github.com/Sagar9980/local-letter)
project and send it through [Resend](https://resend.com) — in one call.

Your templates and their translations live in the local-letter dashboard, so
copy changes ship without a deploy. Your Resend key never leaves your server:
the SDK renders against your API, then talks to Resend directly.

```bash
pip install local-letter
```

Requires Python 3.9+.

## Usage

```python
import os
from local_letter import TemplateClient

letters = TemplateClient(
    base_url="https://letters.yourcompany.com",
    api_key=os.environ["LOCAL_LETTER_API_KEY"],
    resend_api_key=os.environ["RESEND_API_KEY"],
    from_="hello@yourcompany.com",
)

result = letters.send(
    template="welcome-email",
    to="customer@example.com",
    variables={"first_name": "Sagar"},
)

print(result.id)  # Resend message id
```

`variables` fill `{{token}}` placeholders in the template's subject and body. A
token you don't supply is left in place rather than blanked, so a missing
variable shows up in the output instead of vanishing silently.

### Localisation

Pass the recipient's locale and a fallback. The API normalises casing, so
`en-us` and `EN-US` both match `en-US`:

```python
result = letters.send(
    template="welcome-email",
    to=user.email,
    variables={"first_name": user.first_name},
    locale=user.locale,          # "fr" — uses the French version if it exists
    fallback_locale="en",        # otherwise English, then the template default
)
```

`result.locale` tells you which version actually went out.

## API

### `TemplateClient(base_url, api_key, resend_api_key, from_)`

| Argument         | Type  | Notes                                                         |
| ---------------- | ----- | -------------------------------------------------------------- |
| `base_url`       | `str` | Your local-letter API, e.g. `https://letters.yourcompany.com`. |
| `api_key`        | `str` | Project API key, from the dashboard's API Keys page.           |
| `resend_api_key` | `str` | Sent only to Resend. local-letter never receives it.           |
| `from_`          | `str` | Default sender for every `send()`.                             |

### `letters.send(...)`

| Argument          | Type              | Notes                                          |
| ----------------- | ----------------- | ----------------------------------------------- |
| `template`        | `str`             | Template key, e.g. `"welcome-email"`.           |
| `to`               | `str \| list[str]` | One or more recipients.                        |
| `variables`       | `dict`            | Values for the template's `{{tokens}}`.         |
| `locale`          | `str`             | Preferred locale.                               |
| `fallback_locale` | `str`             | Used when `locale` has no translation.          |
| `from_`           | `str`             | Overrides the client default, this send only.   |
| `reply_to`        | `str`             | Reply-to address.                               |

Returns a `SendResult` with `id`, `subject`, `html`, and `locale` — the Resend
message id plus what was actually rendered.

## Errors

Both error types are exported, so you can tell a template problem from a
delivery problem:

```python
from local_letter import TemplateRenderError, TemplateSendError

try:
    letters.send(template="welcome-email", to=user.email)
except TemplateRenderError as err:
    # Your API rejected the render. err.status: 401 bad key, 404 no such
    # template, 403 key not linked to a project.
    ...
except TemplateSendError as err:
    # Rendered fine, Resend refused it — often an unverified sender domain.
    # err.cause holds Resend's own exception.
    ...
```

## Examples

Runnable integrations live in
[`examples/`](https://github.com/Sagar9980/local-letter/tree/main/examples).

## License

MIT
