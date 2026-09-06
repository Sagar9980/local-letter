"""
The smallest possible end-to-end check: render one template and send it.

    python quickstart.py
    python quickstart.py you@example.com          # override TEST_TO

Everything else comes from .env — see .env.example.
"""

import sys

from local_letter import TemplateRenderError, TemplateSendError

from lib.client import create_client, load_config

override_to = sys.argv[1] if len(sys.argv) > 1 else None
config = load_config(require_recipient=not override_to)
to = override_to or config.to
letters = create_client(config)

print(f'Rendering "{config.template_key}" via {config.base_url}')
print(f"Sending    {config.from_} -> {to}\n")

try:
    result = letters.send(
        template=config.template_key,
        to=to,
        variables={
            "first_name": "Sagar",
            # Extra keys the template doesn't use are harmless. The reverse
            # isn't symmetrical: a {{token}} you forget to pass is left in
            # place rather than blanked, so it shows up verbatim in the
            # delivered email.
            "company": "Local Letter",
        },
        locale="en",
        fallback_locale="en",
    )

    print("Sent.")
    print(f"  resend id : {result.id}")
    print(f"  locale    : {result.locale}")
    print(f"  subject   : {result.subject!r}")
    print(f"  html      : {len(result.html)} bytes")
except TemplateRenderError as err:
    # The API rejected the render — bad key, unknown template, or no locale.
    print(f"Render failed (HTTP {err.status}): {err}", file=sys.stderr)
    sys.exit(1)
except TemplateSendError as err:
    # Rendered fine; Resend refused it. Usually an unverified sender domain.
    print(f"Send failed: {err}", file=sys.stderr)
    sys.exit(1)
except Exception as err:
    # Nothing reached the API — wrong base URL, or it isn't running.
    print(f"Unexpected error: {err}", file=sys.stderr)
    sys.exit(1)
