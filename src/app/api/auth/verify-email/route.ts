import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/models/User";
import { appUrl } from "@/lib/mailer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return NextResponse.redirect(`${appUrl()}/login?verified=0`);
    }

    user.emailVerified = new Date();
    user.emailVerificationToken = undefined;
    await user.save();

    return NextResponse.redirect(`${appUrl()}/login?verified=1`);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(`${appUrl()}/login?verified=0`);
  }
}
