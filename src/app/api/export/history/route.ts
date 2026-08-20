import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import ExportHistory from "@/models/ExportHistory";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const history = await ExportHistory.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching export history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
