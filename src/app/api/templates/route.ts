import { NextResponse } from "next/server";
import T from "@/lib/template-data";

const FALLBACK_TEMPLATES = Object.entries(T).map(([id, t]) => ({ _id: id, ...t }));

/* POST: Save current design as a template */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, canvasData, paperSize, orientation, tags, thumbnail } = body;

    if (!name || !canvasData) {
      return NextResponse.json(
        { success: false, error: "Name and canvasData are required" },
        { status: 400 }
      );
    }

    try {
      const { connectToDatabase } = await import("@/lib/db/connect");
      const { default: Template } = await import("@/models/Template");
      await connectToDatabase();

      const template = await Template.create({
        name,
        description: description || "Custom template",
        category: category || "minimal",
        style: "custom",
        orientation: orientation || "portrait",
        paperSize: paperSize || "A4",
        thumbnail: thumbnail || "",
        canvasData,
        isPremium: false,
        tags: tags || ["custom"],
        usageCount: 0,
      });

      return NextResponse.json({
        success: true,
        data: template,
      });
    } catch (dbError) {
      console.error("Failed to save template to DB:", dbError);
      return NextResponse.json(
        { success: false, error: "Database unavailable - template not saved" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

    let templates = FALLBACK_TEMPLATES;
    let usedDB = false;

    try {
      const { connectToDatabase } = await import("@/lib/db/connect");
      const { default: Template } = await import("@/models/Template");
      await connectToDatabase();

      const query: Record<string, unknown> = {};
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const dbTemplates = await Template.find(query)
        .sort({ usageCount: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      if (dbTemplates.length > 0) {
        const { prepareCanvasData } = await import("@/lib/editor-utils");
        templates = dbTemplates.map((t) => ({
          ...t,
          canvasData: t.canvasData ? JSON.parse(prepareCanvasData(t.canvasData as Record<string, unknown>)) : t.canvasData,
        }));
        usedDB = true; // DB already applied the filters — skip JS re-filter below
      }
    } catch {
      // MongoDB not available, using fallback templates
    }

    // Only apply JS-side filters when using the in-memory fallback list
    // (DB results were already filtered by the Mongo query above).
    if (!usedDB) {
      if (category) templates = templates.filter((t) => t.category === category);
      if (search) {
        const re = new RegExp(search, "i");
        templates = templates.filter(
          (t) => re.test(t.name) || re.test(t.description) || t.tags.some((tag) => re.test(tag))
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: templates,
      pagination: { page: 1, limit, total: templates.length, pages: 1 },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
