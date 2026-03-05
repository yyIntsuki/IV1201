"""
Magic link email utility for sending login links.
"""
import os
import json
import logging
import smtplib
from email.mime.text import MIMEText
from urllib import request, error
from dotenv import load_dotenv

load_dotenv()

MAIL_HOST = os.getenv("MAIL_HOST")
MAIL_PORT = int(os.getenv("MAIL_PORT"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "IV1201")


def send_magic_link_email(to_email: str, magic_link: str):
    subject = "Your Login Link"
    body = f"Click the link to log in: {magic_link}\nThis link will expire soon."

    if BREVO_API_KEY:
        payload = {
            "sender": {"name": BREVO_SENDER_NAME, "email": MAIL_FROM},
            "to": [{"email": to_email}],
            "subject": subject,
            "textContent": body,
        }
        req = request.Request(
            "https://api.brevo.com/v3/smtp/email",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=15) as resp:
                if resp.status >= 400:
                    raise RuntimeError(f"Brevo API error: {resp.status}")
            return
        except error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
            logging.error("Brevo API error %s: %s", exc.code, details)
            raise RuntimeError(f"Brevo API error {exc.code}: {details}") from exc
        except error.URLError as exc:
            logging.exception("Brevo API request failed")
            raise exc

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = MAIL_FROM
    msg["To"] = to_email

    with smtplib.SMTP(MAIL_HOST, MAIL_PORT, timeout=15) as server:
        if MAIL_USERNAME and MAIL_PASSWORD:
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_FROM, [to_email], msg.as_string())
