// The smallest possible end-to-end check: render one template and send it.
//
//	go run ./cmd/quickstart
//	go run ./cmd/quickstart you@example.com     # override TEST_TO
//
// Everything else comes from .env — see .env.example.
package main

import (
	"context"
	"errors"
	"fmt"
	"os"

	localletter "github.com/Sagar9980/local-letter/packages/go-sdk"

	"github.com/Sagar9980/local-letter/examples/go/internal/config"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	var overrideTo string
	if len(os.Args) > 1 {
		overrideTo = os.Args[1]
	}

	cfg, err := config.Load(overrideTo == "")
	if err != nil {
		return err
	}
	to := cfg.To
	if overrideTo != "" {
		to = overrideTo
	}

	letters, err := cfg.NewClient()
	if err != nil {
		return err
	}

	fmt.Printf("Rendering %q via %s\n", cfg.TemplateKey, cfg.BaseURL)
	fmt.Printf("Sending    %s -> %s\n\n", cfg.From, to)

	result, err := letters.Send(context.Background(), localletter.SendOptions{
		Template: cfg.TemplateKey,
		To:       []string{to},
		Variables: map[string]any{
			"first_name": "Sagar",
			// Extra keys the template doesn't use are harmless. The reverse
			// isn't symmetrical: a {{token}} you forget to pass is left in
			// place rather than blanked, so it shows up verbatim in the
			// delivered email.
			"company": "Local Letter",
		},
		Locale:         "en",
		FallbackLocale: "en",
	})
	if err != nil {
		return describe(err)
	}

	fmt.Println("Sent.")
	fmt.Printf("  resend id : %s\n", result.ID)
	fmt.Printf("  locale    : %s\n", result.Locale)
	fmt.Printf("  subject   : %q\n", result.Subject)
	fmt.Printf("  html      : %d bytes\n", len(result.HTML))
	return nil
}

// describe turns the SDK's error types into the sort of message you'd want at
// 2am, rather than a bare wrapped error.
func describe(err error) error {
	var renderErr *localletter.RenderError
	var sendErr *localletter.SendError

	switch {
	case errors.As(err, &renderErr):
		// The API rejected the render — bad key, unknown template, or no locale.
		return fmt.Errorf("Render failed (HTTP %d): %s", renderErr.Status, renderErr.Message)
	case errors.As(err, &sendErr):
		// Rendered fine; Resend refused it. Usually an unverified sender domain.
		return fmt.Errorf("Send failed: %s", sendErr.Message)
	default:
		// Nothing reached the API — wrong base URL, or it isn't running.
		return fmt.Errorf("Unexpected error: %w", err)
	}
}
