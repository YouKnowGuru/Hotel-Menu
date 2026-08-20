import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/models/User";
import { rateLimit } from "@/lib/rate-limit";
import { sendMail, appUrl, emailTemplate } from "@/lib/mailer";
import { registerSchema } from "@/lib/validators/schemas";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message || "Invalid registration details" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: "credentials",
      emailVerificationToken: verifyToken,
    });

    // Best-effort verification email; registration still succeeds without it.
    const verifyUrl = `${appUrl()}/api/auth/verify-email?token=${verifyToken}`;
    void sendMail({
      to: user.email,
      subject: "Verify your MenuStudio email",
      html: emailTemplate(
        "Welcome to MenuStudio",
        `Hi ${name}, thanks for signing up! Confirm your email address to secure your account.`,
        { label: "Verify Email", url: verifyUrl }
      ),
    }).catch(() => {});

    return NextResponse.json(
      { message: "Account created", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
