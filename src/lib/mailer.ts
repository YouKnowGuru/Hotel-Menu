interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const FROM = process.env.EMAIL_FROM || "MenuStudio <onboarding@resend.dev>";

/**
 * Send a transactional email through Resend when RESEND_API_KEY is set.
 * Without a key (local development), the email is logged instead so flows
 * such as password reset remain fully testable.
 */
export async function sendMail({ to, subject, html }: SendMailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(`[mailer:dev] To: ${to} | Subject: ${subject}\n${html}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });

    if (!res.ok) {
      console.error("[mailer] send failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[mailer] send error:", error);
    return false;
  }
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function emailTemplate(
  title: string,
  bodyHtml: string,
  cta?: { label: string; url: string }
): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#18181b;border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;color:#a78bfa;font-weight:bold;">MENUSTUDIO</p>
                <h1 style="margin:0 0 16px;font-size:22px;color:#ffffff;">${title}</h1>
                <div style="font-size:14px;line-height:1.6;color:#d4d4d8;">${bodyHtml}</div>
                ${
                  cta
                    ? `<div style="margin-top:24px;"><a href="${cta.url}" style="display:inline-block;background:#8b5cf6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:10px;">${cta.label}</a></div>
                       <p style="margin:16px 0 0;font-size:12px;color:#71717a;word-break:break-all;">Or paste this link into your browser: ${cta.url}</p>`
                    : ""
                }
              </td>
            </tr>
          </table>
          <p style="margin-top:16px;font-size:12px;color:#64748b;">© ${new Date().getFullYear()} MenuStudio. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
