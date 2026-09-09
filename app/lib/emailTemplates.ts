const SITE_URL = "https://www.ubanox.com";
const LOGO_URL = `${SITE_URL}/logo-email.png`;
const ACCENT = "#F7610B";
const TEXT = "#1e1e1e";
const MUTED = "#6b6b6b";
const BORDER = "#e5e5e5";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(bodyHtml: string) {
  return `<!doctype html>
<html>
  <head>
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <img src="${LOGO_URL}" width="140" height="32" alt="Ubanox" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;font-family:Helvetica,Arial,sans-serif;color:${TEXT};font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid ${BORDER};font-family:Helvetica,Arial,sans-serif;color:${MUTED};font-size:12px;">
                Ubanox &middot; Metro Manila, PH &middot; <a href="${SITE_URL}" style="color:${MUTED};">${SITE_URL.replace("https://", "")}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function contactNotificationEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const html = layout(`
    <h1 style="margin:0 0 16px 0;font-size:18px;font-weight:600;">New contact form message</h1>
    <p style="margin:0 0 4px 0;"><strong>From:</strong> ${safeName} &lt;<a href="mailto:${safeEmail}" style="color:${ACCENT};">${safeEmail}</a>&gt;</p>
    <div style="margin-top:16px;padding:16px;background-color:#fafafa;border:1px solid ${BORDER};border-radius:6px;white-space:pre-wrap;">
      ${safeMessage}
    </div>
  `);

  const text = `New contact form message\n\nFrom: ${name} <${email}>\n\n${message}`;

  return {
    subject: `New contact form message from ${name}`,
    text,
    html,
  };
}

export function contactAutoReplyEmail({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const html = layout(`
    <h1 style="margin:0 0 16px 0;font-size:18px;font-weight:600;">We've received your message</h1>
    <p style="margin:0 0 16px 0;">Hi ${safeName},</p>
    <p style="margin:0 0 16px 0;">Thanks for reaching out to Ubanox. We've received your message and will get back to you soon.</p>
    <p style="margin:0 0 8px 0;color:${MUTED};font-size:13px;">Here's a copy of what you sent us:</p>
    <div style="margin-top:4px;padding:16px;background-color:#fafafa;border:1px solid ${BORDER};border-radius:6px;white-space:pre-wrap;color:${MUTED};">
      ${safeMessage}
    </div>
  `);

  const text = `Hi ${name},\n\nThanks for reaching out to Ubanox. We've received your message and will get back to you soon.\n\nHere's a copy of what you sent us:\n\n${message}\n\n— Ubanox`;

  return {
    subject: "We've received your message - Ubanox",
    text,
    html,
  };
}
