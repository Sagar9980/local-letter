import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from unittest.mock import patch

import pytest

from local_letter import TemplateClient, TemplateRenderError, TemplateSendError


class _RenderHandler(BaseHTTPRequestHandler):
    """Stands in for local-letter's render endpoint."""

    routes = {
        "/v1/render/welcome-email": (
            200,
            {
                "success": True,
                "message": "ok",
                "data": {"subject": None, "html": "<p>hi</p>", "locale": "en"},
            },
        ),
        "/v1/render/unknown-template": (
            404,
            {"success": False, "message": "Template not found"},
        ),
        "/v1/render/bad-key": (
            401,
            {"success": False, "message": "Invalid API key"},
        ),
    }

    def do_POST(self):  # noqa: N802 (BaseHTTPRequestHandler's naming)
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length) or b"{}")

        status, payload = self.routes[self.path]
        if payload["success"]:
            payload = dict(payload)
            payload["data"] = dict(payload["data"])
            first_name = (body.get("variables") or {}).get("first_name", "")
            payload["data"]["subject"] = f"Hi {first_name}".strip()

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def log_message(self, *args):  # silence request logging in test output
        pass


@pytest.fixture()
def render_server():
    server = HTTPServer(("localhost", 0), _RenderHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://localhost:{server.server_address[1]}"
    finally:
        server.shutdown()
        thread.join()


@pytest.fixture()
def client(render_server):
    return TemplateClient(
        base_url=render_server,
        api_key="test-api-key",
        resend_api_key="test-resend-key",
        from_="hello@example.com",
    )


def test_send_renders_and_sends(client):
    with patch("resend.Emails.send", return_value={"id": "em_123"}) as mock_send:
        result = client.send(
            template="welcome-email",
            to="customer@example.com",
            variables={"first_name": "Sagar"},
        )

    assert result.id == "em_123"
    assert result.subject == "Hi Sagar"
    assert result.html == "<p>hi</p>"
    assert result.locale == "en"

    sent_params = mock_send.call_args.args[0]
    assert sent_params["from"] == "hello@example.com"
    assert sent_params["to"] == "customer@example.com"
    assert sent_params["subject"] == "Hi Sagar"


def test_send_passes_from_and_reply_to_overrides(client):
    with patch("resend.Emails.send", return_value={"id": "em_456"}) as mock_send:
        client.send(
            template="welcome-email",
            to="customer@example.com",
            from_="override@example.com",
            reply_to="support@example.com",
        )

    sent_params = mock_send.call_args.args[0]
    assert sent_params["from"] == "override@example.com"
    assert sent_params["reply_to"] == "support@example.com"


def test_render_failure_raises_template_render_error(client):
    with pytest.raises(TemplateRenderError) as excinfo:
        client.send(template="unknown-template", to="customer@example.com")

    assert excinfo.value.status == 404
    assert "Template not found" in str(excinfo.value)


def test_render_failure_surfaces_bad_api_key(client):
    with pytest.raises(TemplateRenderError) as excinfo:
        client.send(template="bad-key", to="customer@example.com")

    assert excinfo.value.status == 401


def test_resend_failure_raises_template_send_error(client):
    class _ResendError(Exception):
        pass

    with patch("resend.Emails.send", side_effect=_ResendError("domain not verified")):
        with pytest.raises(TemplateSendError) as excinfo:
            client.send(template="welcome-email", to="customer@example.com")

    assert "domain not verified" in str(excinfo.value)
    assert isinstance(excinfo.value.cause, _ResendError)
