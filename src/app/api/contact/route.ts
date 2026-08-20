import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendMail, emailTemplate } from "@/lib/mailer";
import { contactSchema } from "@/lib/validators/contact";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (rateLimit(`contact:${ip}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message || "Invalid contact details" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Best-effort delivery to the support inbox; always logs when no
    // mail provider is configured so nothing is silently lost in dev.
    await sendMail({
      to: process.env.SUPPORT_EMAIL || "support@menustudio.app",
      subject: `[Contact] ${subject}`,
      html: emailTemplate(
        "New contact message",
        `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p style="white-space:pre-wrap;">${message
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</p>`,
        undefined
      ),
    });

    return NextResponse.json({ success: true, message: "Message sent! We'll get back to you soon." });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
