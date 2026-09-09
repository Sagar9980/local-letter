// Package config reads the example's settings from the environment and fails
// loudly when a credential is missing, so you get a readable message instead
// of a 401 from somewhere deep inside the SDK.
package config

import (
	"fmt"
	"os"
	"strings"

	localletter "github.com/Sagar9980/local-letter/packages/go-sdk"
	"github.com/joho/godotenv"
)

type Config struct {
	BaseURL      string
	APIKey       string
	ResendAPIKey string
	From         string
	TemplateKey  string
	To           string
	Port         string
}

// Load reads .env (real environment variables win over it) and validates what
// it found. Pass requireRecipient for the entry points that send to TEST_TO.
func Load(requireRecipient bool) (*Config, error) {
	// Missing .env is fine — the variables may already be in the environment.
	_ = godotenv.Load()

	cfg := &Config{
		BaseURL:      env("LOCAL_LETTER_BASE_URL", "http://localhost:4000"),
		APIKey:       os.Getenv("LOCAL_LETTER_API_KEY"),
		ResendAPIKey: os.Getenv("RESEND_API_KEY"),
		From:         env("MAIL_FROM", "onboarding@resend.dev"),
		TemplateKey:  env("TEMPLATE_KEY", "welcome-email"),
		To:           os.Getenv("TEST_TO"),
		Port:         env("PORT", "3001"),
	}

	var missing []string
	if cfg.APIKey == "" {
		missing = append(missing, "LOCAL_LETTER_API_KEY")
	}
	if cfg.ResendAPIKey == "" {
		missing = append(missing, "RESEND_API_KEY")
	}
	if requireRecipient && cfg.To == "" {
		missing = append(missing, "TEST_TO")
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf(
			"missing required env vars: %s\nCopy .env.example to .env and fill it in",
			strings.Join(missing, ", "),
		)
	}

	return cfg, nil
}

// NewClient builds the SDK client. One per process — it holds a Resend client
// internally, so there's no reason to rebuild it per request.
func (c *Config) NewClient() (*localletter.Client, error) {
	return localletter.New(localletter.Options{
		BaseURL:      c.BaseURL,
		APIKey:       c.APIKey,
		ResendAPIKey: c.ResendAPIKey,
		From:         c.From,
	})
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
