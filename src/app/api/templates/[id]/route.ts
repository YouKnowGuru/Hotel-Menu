import { NextResponse } from "next/server";
import T from "@/lib/template-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check fallback in-memory templates
    const fallbackTemplate = T[id];

    try {
      const { connectToDatabase } = await import("@/lib/db/connect");
      const { default: Template } = await import("@/models/Template");
      await connectToDatabase();

      const dbTemplate = await Template.findById(id).lean();
      if (dbTemplate) {
        const { prepareCanvasData } = await import("@/lib/editor-utils");
        const canvasData = dbTemplate.canvasData ? JSON.parse(prepareCanvasData(dbTemplate.canvasData as Record<string, unknown>)) : dbTemplate.canvasData;
        return NextResponse.json({
          success: true,
          data: { ...dbTemplate, canvasData },
        });
      }
    } catch {
      // DB not available or not a valid MongoDB ObjectId, check fallback
    }

    if (fallbackTemplate) {
      return NextResponse.json({
        success: true,
        data: { _id: id, ...fallbackTemplate },
      });
    }

    // Check if ID matches an in-memory template _id
    const matchedEntry = Object.entries(T).find(([key]) => key === id);
    if (matchedEntry) {
      return NextResponse.json({
        success: true,
        data: { _id: matchedEntry[0], ...matchedEntry[1] },
      });
    }

    return NextResponse.json(
      { success: false, error: "Template not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
