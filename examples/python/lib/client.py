import os
import sys
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from local_letter import TemplateClient

# Resolved relative to this file rather than the cwd, so the example still
# finds its .env when started from the repo root.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")


class Config:
    def __init__(self) -> None:
        self.base_url = os.environ.get("LOCAL_LETTER_BASE_URL", "http://localhost:4000")
        self.api_key = os.environ.get("LOCAL_LETTER_API_KEY")
        self.resend_api_key = os.environ.get("RESEND_API_KEY")
        self.from_ = os.environ.get("MAIL_FROM", "onboarding@resend.dev")
        self.template_key = os.environ.get("TEMPLATE_KEY", "welcome-email")
        self.to: Optional[str] = os.environ.get("TEST_TO") or None


def load_config(require_recipient: bool = False) -> Config:
    """Reads config from the environment and fails loudly if a credential is
    missing, so you get a readable message instead of a 401 from somewhere
    deep inside the SDK."""
    config = Config()

    missing = []
    if not config.api_key:
        missing.append("LOCAL_LETTER_API_KEY")
    if not config.resend_api_key:
        missing.append("RESEND_API_KEY")
    if require_recipient and not config.to:
        missing.append("TEST_TO")

    if missing:
        print(f"Missing required env vars: {', '.join(missing)}", file=sys.stderr)
        print("Copy .env.example to .env and fill it in.", file=sys.stderr)
        raise SystemExit(1)

    return config


def create_client(config: Config) -> TemplateClient:
    """One client per process — the SDK holds a Resend client internally, so
    there's no reason to rebuild it per request."""
    return TemplateClient(
        base_url=config.base_url,
        api_key=config.api_key,
        resend_api_key=config.resend_api_key,
        from_=config.from_,
    )
