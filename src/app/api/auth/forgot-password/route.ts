import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/models/User";
import { rateLimit } from "@/lib/rate-limit";
import { sendMail, appUrl, emailTemplate } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const resetUrl = `${appUrl()}/reset-password?token=${token}`;
      await sendMail({
        to: user.email,
        subject: "Reset your MenuStudio password",
        html: emailTemplate(
          "Reset your password",
          "We received a request to reset your MenuStudio password. This link is valid for <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.",
          { label: "Reset Password", url: resetUrl }
        ),
      });
    }

    // Always respond identically so the endpoint can't be used to
    // enumerate which email addresses are registered.
    return NextResponse.json({
      success: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
