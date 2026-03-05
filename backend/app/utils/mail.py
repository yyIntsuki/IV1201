"""
Magic link email utility for sending login links.
"""
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

MAIL_HOST = os.getenv("MAIL_HOST")
MAIL_PORT = int(os.getenv("MAIL_PORT"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")


def send_magic_link_email(to_email: str, magic_link: str):
    subject = "Your Login Link"
    body = f"Click the link to log in: {magic_link}\nThis link will expire soon."
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = MAIL_FROM
    msg["To"] = to_email

    with smtplib.SMTP(MAIL_HOST, MAIL_PORT) as server:
        if MAIL_USERNAME and MAIL_PASSWORD:
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_FROM, [to_email], msg.as_string())
