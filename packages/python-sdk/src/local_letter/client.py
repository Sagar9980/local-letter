from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Union

import requests
import resend


class TemplateRenderError(Exception):
    """Raised when the local-letter API rejects a render request."""

    def __init__(self, message: str, status: int):
        super().__init__(message)
        self.status = status


class TemplateSendError(Exception):
    """Raised when the template rendered fine but Resend refused to send it."""

    def __init__(self, message: str, cause: Optional[BaseException] = None):
        super().__init__(message)
        self.cause = cause


@dataclass
class SendResult:
    id: str
    subject: str
    html: str
    locale: Optional[str]


class TemplateClient:
    """Renders a local-letter template and sends it via Resend, in one call."""

    def __init__(self, base_url: str, api_key: str, resend_api_key: str, from_: str):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.from_ = from_
        resend.api_key = resend_api_key

    def _render(
        self,
        template: str,
        variables: Optional[Dict[str, Any]] = None,
        locale: Optional[str] = None,
        fallback_locale: Optional[str] = None,
    ) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_url}/v1/render/{template}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            json={
                "variables": variables or {},
                "locale": locale,
                "fallbackLocale": fallback_locale,
            },
        )

        try:
            body = response.json()
        except ValueError:
            body = None

        if not response.ok or not body or not body.get("success"):
            message = (body or {}).get("message") or "Failed to render template"
            raise TemplateRenderError(message, response.status_code)

        return body["data"]

    def send(
        self,
        template: str,
        to: Union[str, List[str]],
        variables: Optional[Dict[str, Any]] = None,
        locale: Optional[str] = None,
        fallback_locale: Optional[str] = None,
        from_: Optional[str] = None,
        reply_to: Optional[str] = None,
    ) -> SendResult:
        """Renders `template` with `variables` and sends it via Resend in one call."""
        rendered = self._render(
            template,
            variables=variables,
            locale=locale,
            fallback_locale=fallback_locale,
        )

        params: Dict[str, Any] = {
            "from": from_ or self.from_,
            "to": to,
            "subject": rendered["subject"],
            "html": rendered["html"],
        }
        if reply_to:
            params["reply_to"] = reply_to

        try:
            email = resend.Emails.send(params)
        except Exception as error:
            raise TemplateSendError(str(error) or "Resend failed to send the email", error) from error

        return SendResult(
            id=email["id"],
            subject=rendered["subject"],
            html=rendered["html"],
            locale=rendered.get("locale"),
        )
