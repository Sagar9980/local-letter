# local-letter for Go

Render an email template from your [local-letter](https://github.com/Sagar9980/local-letter)
project and send it through [Resend](https://resend.com) — in one call.

Your templates and their translations live in the local-letter dashboard, so
copy changes ship without a deploy. Your Resend key never leaves your server:
the SDK renders against your API, then talks to Resend directly.

```bash
go get github.com/Sagar9980/local-letter/packages/go-sdk
```

Requires Go 1.23+. There's nothing to publish to a registry — the module is
served straight from this repository (see [Versioning](#versioning)).

## Usage

The import path ends in `go-sdk`, but the package is named `localletter`, so
import it under that name:

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"

    localletter "github.com/Sagar9980/local-letter/packages/go-sdk"
)

func main() {
    letters, err := localletter.New(localletter.Options{
        BaseURL:      "https://letters.yourcompany.com",
        APIKey:       os.Getenv("LOCAL_LETTER_API_KEY"),
        ResendAPIKey: os.Getenv("RESEND_API_KEY"),
        From:         "hello@yourcompany.com",
    })
    if err != nil {
        log.Fatal(err)
    }

    result, err := letters.Send(context.Background(), localletter.SendOptions{
        Template:  "welcome-email",
        To:        []string{"customer@example.com"},
        Variables: map[string]any{"first_name": "Sagar"},
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(result.ID) // Resend message id
}
```

`Variables` fill `{{token}}` placeholders in the template's subject and body. A
token you don't supply is left in place rather than blanked, so a missing
variable shows up in the output instead of vanishing silently.

`New` fails when a credential is missing, so a typo shows up at startup rather
than as a 401 on your first send. A `*Client` is safe for concurrent use —
build one per process, not per request.

### Localisation

Pass the recipient's locale and a fallback. The API normalises casing, so
`en-us` and `EN-US` both match `en-US`:

```go
result, err := letters.Send(ctx, localletter.SendOptions{
    Template:       "welcome-email",
    To:             []string{user.Email},
    Variables:      map[string]any{"first_name": user.FirstName},
    Locale:         user.Locale, // "fr" — uses the French version if it exists
    FallbackLocale: "en",        // otherwise English, then the template default
})
```

`result.Locale` tells you which version actually went out.

## API

### `localletter.New(localletter.Options{...}) (*Client, error)`

| Field          | Type           | Notes                                                              |
| -------------- | -------------- | ------------------------------------------------------------------ |
| `BaseURL`      | `string`       | Your local-letter API, e.g. `https://letters.yourcompany.com`.      |
| `APIKey`       | `string`       | Project API key, from the dashboard's API Keys page.                |
| `ResendAPIKey` | `string`       | Sent only to Resend. local-letter never receives it.                |
| `From`         | `string`       | Default sender for every `Send`.                                    |
| `HTTPClient`   | `*http.Client` | Optional. Used for both the render call and Resend; defaults to a client with a 30s timeout. |

### `letters.Send(ctx, localletter.SendOptions{...}) (*SendResult, error)`

| Field            | Type             | Notes                                        |
| ---------------- | ---------------- | -------------------------------------------- |
| `Template`       | `string`         | Template key, e.g. `"welcome-email"`.        |
| `To`             | `[]string`       | One or more recipients.                      |
| `Variables`      | `map[string]any` | Values for the template's `{{tokens}}`.      |
| `Locale`         | `string`         | Preferred locale.                            |
| `FallbackLocale` | `string`         | Used when `Locale` has no translation.       |
| `From`           | `string`         | Overrides the client default, this send only.|
| `ReplyTo`        | `string`         | Reply-to address.                            |

Returns a `*SendResult` with `ID`, `Subject`, `HTML`, and `Locale` — the Resend
message id plus what was actually rendered. The `ctx` is threaded through both
the render call and Resend, so a cancelled request stops the whole chain.

## Errors

Both error types are exported, so you can tell a template problem from a
delivery problem:

```go
result, err := letters.Send(ctx, opts)

var renderErr *localletter.RenderError
var sendErr *localletter.SendError

switch {
case errors.As(err, &renderErr):
    // Your API rejected the render. renderErr.Status: 401 bad key, 404 no
    // such template, 403 key not linked to a project.
case errors.As(err, &sendErr):
    // Rendered fine, Resend refused it — often an unverified sender domain.
    // errors.Unwrap(sendErr) holds Resend's own error.
case err != nil:
    // Nothing reached the API — wrong base URL, or it isn't running.
}
```

## Versioning

Go modules are fetched from source control, so releasing is a git tag rather
than a registry upload. This module lives in a subdirectory, so its tags carry
that path as a prefix:

```bash
git tag packages/go-sdk/v0.1.0
git push origin packages/go-sdk/v0.1.0
```

Users then get that release with
`go get github.com/Sagar9980/local-letter/packages/go-sdk@v0.1.0`. Until a
`v1.0.0` tag exists, `@latest` resolves to the newest `v0.x` tag, or to the
default branch's latest commit if there are none.

Tags are immutable once `proxy.golang.org` has cached them — to fix a bad
release, publish the next patch version rather than moving the tag.

## Examples

Runnable integrations live in
[`examples/go`](https://github.com/Sagar9980/local-letter/tree/main/examples/go).

## License

MIT
