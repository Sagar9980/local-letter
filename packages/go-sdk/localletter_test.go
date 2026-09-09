package localletter

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/resend/resend-go/v2"
)

// fakeSender stands in for Resend: it records what it was asked to send and
// returns whatever the test set up.
type fakeSender struct {
	got *resend.SendEmailRequest
	res *resend.SendEmailResponse
	err error
}

func (f *fakeSender) SendWithContext(_ context.Context, params *resend.SendEmailRequest) (*resend.SendEmailResponse, error) {
	f.got = params
	return f.res, f.err
}

// renderServer stands in for local-letter's render endpoint. It echoes
// first_name back in the subject so tests can prove variables made the trip.
func renderServer(t *testing.T) *httptest.Server {
	t.Helper()

	routes := map[string]struct {
		status  int
		payload map[string]any
	}{
		"/v1/render/welcome-email": {http.StatusOK, map[string]any{
			"success": true,
			"message": "ok",
			"data":    map[string]any{"html": "<p>hi</p>", "locale": "en"},
		}},
		"/v1/render/unknown-template": {http.StatusNotFound, map[string]any{
			"success": false, "message": "Template not found",
		}},
		"/v1/render/bad-key": {http.StatusUnauthorized, map[string]any{
			"success": false, "message": "Invalid API key",
		}},
		"/v1/render/html-error": {http.StatusBadGateway, nil},
	}

	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		route, ok := routes[r.URL.Path]
		if !ok {
			t.Errorf("unexpected request path %q", r.URL.Path)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if got := r.Header.Get("Authorization"); got != "Bearer test-api-key" {
			t.Errorf("Authorization = %q, want %q", got, "Bearer test-api-key")
		}

		var body struct {
			Variables      map[string]any `json:"variables"`
			Locale         string         `json:"locale"`
			FallbackLocale string         `json:"fallbackLocale"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Errorf("decoding request body: %v", err)
		}

		if route.payload == nil {
			// A proxy erroring out with something that isn't JSON.
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(route.status)
			_, _ = w.Write([]byte("<html>502</html>"))
			return
		}

		payload := route.payload
		if payload["success"] == true {
			data := payload["data"].(map[string]any)
			firstName, _ := body.Variables["first_name"].(string)
			data["subject"] = strings.TrimSpace("Hi " + firstName)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(route.status)
		_ = json.NewEncoder(w).Encode(payload)
	}))
}

// newTestClient wires a client to the stub render server and a fake Resend.
func newTestClient(t *testing.T, baseURL string, sender emailSender) *Client {
	t.Helper()

	client, err := New(Options{
		BaseURL:      baseURL,
		APIKey:       "test-api-key",
		ResendAPIKey: "test-resend-key",
		From:         "hello@example.com",
	})
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}
	client.emails = sender
	return client
}

func TestSendRendersAndSends(t *testing.T) {
	server := renderServer(t)
	defer server.Close()

	sender := &fakeSender{res: &resend.SendEmailResponse{Id: "em_123"}}
	client := newTestClient(t, server.URL, sender)

	result, err := client.Send(context.Background(), SendOptions{
		Template:  "welcome-email",
		To:        []string{"customer@example.com"},
		Variables: map[string]any{"first_name": "Sagar"},
	})
	if err != nil {
		t.Fatalf("Send() error = %v", err)
	}

	if result.ID != "em_123" {
		t.Errorf("ID = %q, want %q", result.ID, "em_123")
	}
	if result.Subject != "Hi Sagar" {
		t.Errorf("Subject = %q, want %q", result.Subject, "Hi Sagar")
	}
	if result.HTML != "<p>hi</p>" {
		t.Errorf("HTML = %q, want %q", result.HTML, "<p>hi</p>")
	}
	if result.Locale != "en" {
		t.Errorf("Locale = %q, want %q", result.Locale, "en")
	}

	if sender.got.From != "hello@example.com" {
		t.Errorf("From = %q, want the client default", sender.got.From)
	}
	if len(sender.got.To) != 1 || sender.got.To[0] != "customer@example.com" {
		t.Errorf("To = %v, want [customer@example.com]", sender.got.To)
	}
	if sender.got.Subject != "Hi Sagar" {
		t.Errorf("sent Subject = %q, want the rendered one", sender.got.Subject)
	}
}

func TestSendPassesFromAndReplyToOverrides(t *testing.T) {
	server := renderServer(t)
	defer server.Close()

	sender := &fakeSender{res: &resend.SendEmailResponse{Id: "em_456"}}
	client := newTestClient(t, server.URL, sender)

	if _, err := client.Send(context.Background(), SendOptions{
		Template: "welcome-email",
		To:       []string{"customer@example.com"},
		From:     "override@example.com",
		ReplyTo:  "support@example.com",
	}); err != nil {
		t.Fatalf("Send() error = %v", err)
	}

	if sender.got.From != "override@example.com" {
		t.Errorf("From = %q, want the per-send override", sender.got.From)
	}
	if sender.got.ReplyTo != "support@example.com" {
		t.Errorf("ReplyTo = %q, want support@example.com", sender.got.ReplyTo)
	}
}

func TestSendTrimsTrailingSlashFromBaseURL(t *testing.T) {
	server := renderServer(t)
	defer server.Close()

	sender := &fakeSender{res: &resend.SendEmailResponse{Id: "em_789"}}
	client := newTestClient(t, server.URL+"/", sender)

	if _, err := client.Send(context.Background(), SendOptions{
		Template: "welcome-email",
		To:       []string{"customer@example.com"},
	}); err != nil {
		t.Fatalf("Send() error = %v", err)
	}
}

func TestRenderFailureReturnsRenderError(t *testing.T) {
	server := renderServer(t)
	defer server.Close()

	client := newTestClient(t, server.URL, &fakeSender{})

	cases := []struct {
		name       string
		template   string
		wantStatus int
		wantIn     string
	}{
		{"unknown template", "unknown-template", http.StatusNotFound, "Template not found"},
		{"bad api key", "bad-key", http.StatusUnauthorized, "Invalid API key"},
		{"non-JSON response", "html-error", http.StatusBadGateway, "Failed to render template"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			_, err := client.Send(context.Background(), SendOptions{
				Template: tc.template,
				To:       []string{"customer@example.com"},
			})

			var renderErr *RenderError
			if !errors.As(err, &renderErr) {
				t.Fatalf("Send() error = %v, want *RenderError", err)
			}
			if renderErr.Status != tc.wantStatus {
				t.Errorf("Status = %d, want %d", renderErr.Status, tc.wantStatus)
			}
			if !strings.Contains(renderErr.Error(), tc.wantIn) {
				t.Errorf("Error() = %q, want it to contain %q", renderErr.Error(), tc.wantIn)
			}
		})
	}
}

func TestResendFailureReturnsSendError(t *testing.T) {
	server := renderServer(t)
	defer server.Close()

	resendErr := errors.New("domain not verified")
	client := newTestClient(t, server.URL, &fakeSender{err: resendErr})

	_, err := client.Send(context.Background(), SendOptions{
		Template: "welcome-email",
		To:       []string{"customer@example.com"},
	})

	var sendErr *SendError
	if !errors.As(err, &sendErr) {
		t.Fatalf("Send() error = %v, want *SendError", err)
	}
	if !strings.Contains(sendErr.Error(), "domain not verified") {
		t.Errorf("Error() = %q, want it to mention the cause", sendErr.Error())
	}
	if !errors.Is(err, resendErr) {
		t.Error("errors.Is() did not unwrap to Resend's own error")
	}
}

func TestNewRequiresCredentials(t *testing.T) {
	_, err := New(Options{BaseURL: "http://localhost:4000"})
	if err == nil {
		t.Fatal("New() error = nil, want a missing-credentials error")
	}
	for _, want := range []string{"APIKey", "ResendAPIKey"} {
		if !strings.Contains(err.Error(), want) {
			t.Errorf("error = %q, want it to name %s", err.Error(), want)
		}
	}
}

func TestSendValidatesOptions(t *testing.T) {
	server := renderServer(t)
	defer server.Close()

	client := newTestClient(t, server.URL, &fakeSender{})

	if _, err := client.Send(context.Background(), SendOptions{To: []string{"a@example.com"}}); err == nil {
		t.Error("Send() without Template: error = nil, want one")
	}
	if _, err := client.Send(context.Background(), SendOptions{Template: "welcome-email"}); err == nil {
		t.Error("Send() without To: error = nil, want one")
	}
}
