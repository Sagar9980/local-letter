// A realistic net/http integration: the app owns its own signup flow, and
// local-letter is just the thing it calls to get an email out.
//
//	go run ./cmd/server
//
//	curl -X POST localhost:3001/signup \
//	  -H 'content-type: application/json' \
//	  -d '{"email":"you@example.com","name":"Sagar"}'
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	localletter "github.com/Sagar9980/local-letter/packages/go-sdk"

	"github.com/Sagar9980/local-letter/examples/go/internal/config"
)

type server struct {
	cfg     *config.Config
	letters *localletter.Client
}

func main() {
	cfg, err := config.Load(false)
	if err != nil {
		log.Fatal(err)
	}
	letters, err := cfg.NewClient()
	if err != nil {
		log.Fatal(err)
	}

	srv := &server{cfg: cfg, letters: letters}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", srv.health)
	mux.HandleFunc("/signup", srv.signup)
	mux.HandleFunc("/emails/send", srv.sendEmail)

	addr := ":" + cfg.Port
	fmt.Printf("example app on http://localhost:%s\n", cfg.Port)
	fmt.Printf("  -> local-letter at %s\n", cfg.BaseURL)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func (s *server) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"baseUrl": s.cfg.BaseURL,
		"from":    s.cfg.From,
	})
}

// signup is the realistic case: a handler that emails a new user. The send is
// done inline so failures surface in the response — in production you'd more
// likely queue it and let signup succeed regardless.
func (s *server) signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"error": "POST only"})
		return
	}

	var body struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Email == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "email is required"})
		return
	}

	name := body.Name
	if name == "" {
		name, _, _ = strings.Cut(body.Email, "@")
	}

	result, err := s.letters.Send(r.Context(), localletter.SendOptions{
		Template: s.cfg.TemplateKey,
		To:       []string{body.Email},
		Variables: map[string]any{
			"first_name": name,
			"company":    "Local Letter",
		},
		// Honour the browser's language when the template has a translation
		// for it, and fall back to English when it doesn't.
		Locale:         preferredLocale(r),
		FallbackLocale: "en",
	})
	if err != nil {
		s.writeSendError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"userId":  "usr_demo",
		"emailId": result.ID,
		"locale":  result.Locale,
	})
}

// sendEmail is a generic passthrough, handy for poking at any template without
// editing code.
func (s *server) sendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"error": "POST only"})
		return
	}

	var body struct {
		Template  string         `json:"template"`
		To        string         `json:"to"`
		Variables map[string]any `json:"variables"`
		Locale    string         `json:"locale"`
		ReplyTo   string         `json:"replyTo"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Template == "" || body.To == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "template and to are required"})
		return
	}

	result, err := s.letters.Send(r.Context(), localletter.SendOptions{
		Template:       body.Template,
		To:             []string{body.To},
		Variables:      body.Variables,
		Locale:         body.Locale,
		FallbackLocale: "en",
		ReplyTo:        body.ReplyTo,
	})
	if err != nil {
		s.writeSendError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"id":      result.ID,
		"subject": result.Subject,
		"locale":  result.Locale,
	})
}

// writeSendError maps the SDK's two failure modes onto status codes: a missing
// template is the caller's fault, anything else upstream is a 502.
func (s *server) writeSendError(w http.ResponseWriter, err error) {
	var renderErr *localletter.RenderError
	var sendErr *localletter.SendError

	switch {
	case errors.As(err, &renderErr):
		log.Printf("render failed (%d): %s", renderErr.Status, renderErr.Message)
		status := http.StatusBadGateway
		if renderErr.Status == http.StatusNotFound {
			status = http.StatusNotFound
		}
		writeJSON(w, status, map[string]any{"error": renderErr.Error()})
	case errors.As(err, &sendErr):
		log.Printf("resend rejected the message: %s", sendErr.Message)
		writeJSON(w, http.StatusBadGateway, map[string]any{"error": sendErr.Error()})
	default:
		log.Printf("unexpected error: %v", err)
		writeJSON(w, http.StatusBadGateway, map[string]any{"error": err.Error()})
	}
}

// preferredLocale pulls the first tag out of Accept-Language, dropping the
// q-weights. Good enough for a demo; use golang.org/x/text/language for real
// negotiation.
func preferredLocale(r *http.Request) string {
	header := r.Header.Get("Accept-Language")
	if header == "" {
		return ""
	}
	first, _, _ := strings.Cut(header, ",")
	tag, _, _ := strings.Cut(first, ";")
	return strings.TrimSpace(tag)
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}
