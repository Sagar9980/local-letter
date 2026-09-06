"""
A realistic Flask integration: the app owns its own signup flow, and
local-letter is just the thing it calls to get an email out.

    python server.py          (or: flask --app server run --debug)

    curl -X POST localhost:3001/signup \\
      -H 'content-type: application/json' \\
      -d '{"email":"you@example.com","name":"Sagar"}'
"""

import os

from flask import Flask, jsonify, request
from local_letter import TemplateRenderError, TemplateSendError

from lib.client import create_client, load_config

config = load_config()
letters = create_client(config)

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify(ok=True, baseUrl=config.base_url, from_=config.from_)


@app.post("/signup")
def signup():
    """The realistic case: a signup handler that emails a new user. The send
    is awaited here so failures surface in the response — in production
    you'd more likely queue it and let signup succeed regardless."""
    body = request.get_json(silent=True) or {}
    email = body.get("email")
    if not email:
        return jsonify(error="email is required"), 400

    try:
        result = letters.send(
            template=config.template_key,
            to=email,
            variables={
                "first_name": body.get("name") or email.split("@")[0],
                "company": "Local Letter",
            },
            # Honour the browser's language when the template has a
            # translation for it, and fall back to English when it doesn't.
            locale=request.accept_languages.best,
            fallback_locale="en",
        )
        return jsonify(userId="usr_demo", emailId=result.id, locale=result.locale), 201
    except TemplateRenderError as err:
        app.logger.error("render failed (%s): %s", err.status, err)
        return jsonify(error=str(err)), 404 if err.status == 404 else 502
    except TemplateSendError as err:
        app.logger.error("resend rejected the message: %s", err)
        return jsonify(error=str(err)), 502


@app.post("/emails/send")
def send_email():
    """A generic passthrough, handy for poking at any template without
    editing code."""
    body = request.get_json(silent=True) or {}
    template = body.get("template")
    to = body.get("to")
    if not template or not to:
        return jsonify(error="template and to are required"), 400

    try:
        result = letters.send(
            template=template,
            to=to,
            variables=body.get("variables"),
            locale=body.get("locale"),
            fallback_locale="en",
            reply_to=body.get("replyTo"),
        )
        return jsonify(id=result.id, subject=result.subject, locale=result.locale)
    except TemplateRenderError as err:
        return jsonify(error=str(err)), 404 if err.status == 404 else 502
    except TemplateSendError as err:
        return jsonify(error=str(err)), 502


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))
    print(f"example app on http://localhost:{port}")
    print(f"  -> local-letter at {config.base_url}")
    app.run(port=port)
