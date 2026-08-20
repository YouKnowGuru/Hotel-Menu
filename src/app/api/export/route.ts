import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import ExportHistory from "@/models/ExportHistory";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { canvasData, format, dpi, quality, paperSize, orientation, projectId, fileUrl } = body;

    if (!canvasData) {
      return NextResponse.json({ error: "Canvas data is required" }, { status: 400 });
    }

    const validFormats = ["pdf", "png", "jpg"];
    if (!validFormats.includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const exportConfig = {
      format,
      dpi: Math.min(Math.max(dpi || 300, 72), 600),
      quality: Math.min(Math.max(quality || 1, 0.1), 1),
      paperSize: paperSize || "A4",
      orientation: orientation || "portrait",
    };

    if (projectId) {
      try {
        await connectToDatabase();
        await ExportHistory.create({
          userId: session.user.id,
          projectId,
          format,
          dpi: exportConfig.dpi,
          fileSize: 0,
          fileUrl: fileUrl || "",
        });
      } catch {
        // History save is best-effort, don't fail the export
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        config: exportConfig,
        message: "Export configuration prepared. Client-side export will be used.",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
