import { NextResponse } from "next/server";

/* GET: List all versions for a project */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { connectToDatabase } = await import("@/lib/db/connect");
        const { default: Project } = await import("@/models/Project");
        await connectToDatabase();

        const project = await Project.findById(id).select("versions").lean();
        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project.versions || [],
        });
    } catch (error) {
        console.error("Error fetching versions:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

/* POST: Create a new version snapshot */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, canvasData } = body;

        if (!canvasData) {
            return NextResponse.json(
                { success: false, error: "canvasData is required" },
                { status: 400 }
            );
        }

        const { connectToDatabase } = await import("@/lib/db/connect");
        const { default: Project } = await import("@/models/Project");
        await connectToDatabase();

        const version = {
            name: name || `Version ${new Date().toLocaleString()}`,
            canvasData,
            createdAt: new Date(),
        };

        const project = await Project.findByIdAndUpdate(
            id,
            { $push: { versions: { $each: [version], $slice: -20 } } }, // Keep last 20 versions
            { new: true }
        ).select("versions");

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project.versions,
        });
    } catch (error) {
        console.error("Error creating version:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}