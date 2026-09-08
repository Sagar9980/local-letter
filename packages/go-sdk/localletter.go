// Package localletter renders an email template from a local-letter project
// and sends it through Resend, in one call.
//
// Templates and their translations live in the local-letter dashboard, so copy
// changes ship without a deploy. The Resend key never leaves the caller's
// server: the SDK renders against the local-letter API, then talks to Resend
// directly.
package localletter

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/resend/resend-go/v2"
)

// Options configures a Client.
type Options struct {
	// BaseURL of the local-letter API, e.g. https://letters.yourcompany.com.
	// A trailing slash is trimmed.
	BaseURL string
	// APIKey is a project API key, generated from the dashboard's API Keys page.
	APIKey string
	// ResendAPIKey is never sent to local-letter — it is used only to call
	// Resend directly.
	ResendAPIKey string
	// From is the default sender for every Send that doesn't override it.
	From string
	// HTTPClient is used for both the render call and Resend. Optional; a
	// client with a 30s timeout is used when nil.
	HTTPClient *http.Client
}

// SendOptions describes a single send.
type SendOptions struct {
	// Template key, e.g. "welcome-email".
	Template string
	// To is one or more recipients.
	To []string
	// Variables fill the {{token}} placeholders in the template.
	Variables map[string]any
	// Locale is the recipient's preferred locale, e.g. "fr". Casing is
	// normalised by the API, so "en-us" matches "en-US".
	Locale string
	// FallbackLocale is used when Locale has no translation.
	FallbackLocale string
	// From overrides the client's default sender, for this send only.
	From string
	// ReplyTo address, optional.
	ReplyTo string
}

// SendResult is the Resend message id plus what was actually rendered.
type SendResult struct {
	ID      string
	Subject string
	HTML    string
	Locale  string
}

// RenderError is returned when the local-letter API rejects a render request.
// Status carries the HTTP status: 401 bad key, 403 key not linked to a
// project, 404 no such template.
type RenderError struct {
	Message string
	Status  int
}

func (e *RenderError) Error() string {
	return fmt.Sprintf("local-letter: render failed (HTTP %d): %s", e.Status, e.Message)
}

// SendError is returned when the template rendered fine but Resend refused to
// send it — often an unverified sender domain. Err holds Resend's own error.
type SendError struct {
	Message string
	Err     error
}

func (e *SendError) Error() string {
	return "local-letter: " + e.Message
}

func (e *SendError) Unwrap() error { return e.Err }

// emailSender is the slice of Resend's API this SDK uses. Narrowing it to an
// interface keeps the Resend client swappable in tests.
type emailSender interface {
	SendWithContext(ctx context.Context, params *resend.SendEmailRequest) (*resend.SendEmailResponse, error)
}

// Client renders local-letter templates and sends them via Resend. It is safe
// for concurrent use, so build one per process rather than per request.
type Client struct {
	baseURL string
	apiKey  string
	from    string
	http    *http.Client
	emails  emailSender
}

// New returns a Client. It fails if a credential is missing, so a typo shows
// up at startup instead of as a 401 on the first send.
func New(opts Options) (*Client, error) {
	var missing []string
	if opts.BaseURL == "" {
		missing = append(missing, "BaseURL")
	}
	if opts.APIKey == "" {
		missing = append(missing, "APIKey")
	}
	if opts.ResendAPIKey == "" {
		missing = append(missing, "ResendAPIKey")
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("local-letter: missing required option(s): %s", strings.Join(missing, ", "))
	}

	httpClient := opts.HTTPClient
	if httpClient == nil {
		httpClient = &http.Client{Timeout: 30 * time.Second}
	}

	return &Client{
		baseURL: strings.TrimRight(opts.BaseURL, "/"),
		apiKey:  opts.APIKey,
		from:    opts.From,
		http:    httpClient,
		emails:  resend.NewCustomClient(httpClient, opts.ResendAPIKey).Emails,
	}, nil
}

// renderResponse is the payload local-letter returns for a render.
type renderResponse struct {
	Subject string `json:"subject"`
	HTML    string `json:"html"`
	Locale  string `json:"locale"`
}

// apiEnvelope wraps every local-letter response; unwrap it here so the rest of
// the SDK deals in plain payloads.
type apiEnvelope struct {
	Success bool           `json:"success"`
	Message string         `json:"message"`
	Data    renderResponse `json:"data"`
}

func (c *Client) render(ctx context.Context, opts SendOptions) (*renderResponse, error) {
	payload, err := json.Marshal(map[string]any{
		"variables":      orEmpty(opts.Variables),
		"locale":         opts.Locale,
		"fallbackLocale": opts.FallbackLocale,
	})
	if err != nil {
		return nil, fmt.Errorf("local-letter: encoding variables: %w", err)
	}

	endpoint := c.baseURL + "/v1/render/" + url.PathEscape(opts.Template)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("local-letter: building render request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	res, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("local-letter: calling %s: %w", endpoint, err)
	}
	defer res.Body.Close()

	// A failed render can come back as HTML from a proxy, so a decode error
	// is not itself fatal — the status still tells us what went wrong.
	var body apiEnvelope
	decodeErr := json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&body)

	if res.StatusCode < 200 || res.StatusCode >= 300 || decodeErr != nil || !body.Success {
		message := body.Message
		if message == "" {
			message = "Failed to render template"
		}
		return nil, &RenderError{Message: message, Status: res.StatusCode}
	}

	return &body.Data, nil
}

// Send renders opts.Template with opts.Variables and sends it via Resend.
//
// It returns a *RenderError if the API rejected the render, and a *SendError
// if Resend refused the message; both are matchable with errors.As.
func (c *Client) Send(ctx context.Context, opts SendOptions) (*SendResult, error) {
	if opts.Template == "" {
		return nil, errors.New("local-letter: Template is required")
	}
	if len(opts.To) == 0 {
		return nil, errors.New("local-letter: To is required")
	}

	from := opts.From
	if from == "" {
		from = c.from
	}
	if from == "" {
		return nil, errors.New("local-letter: no sender — set From on the client or on the send")
	}

	rendered, err := c.render(ctx, opts)
	if err != nil {
		return nil, err
	}

	sent, err := c.emails.SendWithContext(ctx, &resend.SendEmailRequest{
		From:    from,
		To:      opts.To,
		Subject: rendered.Subject,
		Html:    rendered.HTML,
		ReplyTo: opts.ReplyTo,
	})
	if err != nil {
		return nil, &SendError{Message: err.Error(), Err: err}
	}
	if sent == nil || sent.Id == "" {
		return nil, &SendError{Message: "Resend failed to send the email"}
	}

	return &SendResult{
		ID:      sent.Id,
		Subject: rendered.Subject,
		HTML:    rendered.HTML,
		Locale:  rendered.Locale,
	}, nil
}

// orEmpty keeps a nil map out of the request body, so the API always sees an
// object rather than a JSON null.
func orEmpty(v map[string]any) map[string]any {
	if v == nil {
		return map[string]any{}
	}
	return v
}
