import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validators/schemas";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const projects = await Project.find({
      userId: session.user.id,
      status: { $ne: "deleted" },
    })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, description, templateId, paperSize, orientation, customWidth, customHeight, canvasData } =
      parsed.data;

    await connectToDatabase();
    const project = await Project.create({
      userId: session.user.id,
      name,
      description,
      templateId,
      paperSize: paperSize || "A4",
      orientation: orientation || "portrait",
      ...(paperSize === "custom" ? { customWidth, customHeight } : {}),
      canvasData:
        canvasData || { objects: [], background: { type: "solid", value: "#ffffff" } },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
