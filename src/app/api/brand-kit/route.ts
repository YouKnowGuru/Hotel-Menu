import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import BrandKit from "@/models/BrandKit";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const brandKits = await BrandKit.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({ success: true, data: brandKits });
  } catch (error) {
    console.error("Error fetching brand kits:", error);
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
    const { name, logo, primaryColor, secondaryColor, accentColor, fonts } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectToDatabase();
    const brandKit = await BrandKit.create({
      userId: session.user.id,
      name,
      logo,
      primaryColor: primaryColor || "#000000",
      secondaryColor: secondaryColor || "#ffffff",
      accentColor: accentColor || "#f59e0b",
      fonts: {
        heading: fonts?.heading || "Playfair Display",
        body: fonts?.body || "Inter",
        accent: fonts?.accent || "Dancing Script",
      },
    });

    return NextResponse.json({ success: true, data: brandKit }, { status: 201 });
  } catch (error) {
    console.error("Error creating brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Brand kit ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const brandKit = await BrandKit.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!brandKit) {
      return NextResponse.json({ error: "Brand kit not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: brandKit });
  } catch (error) {
    console.error("Error updating brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        /* no body */
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Brand kit ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await BrandKit.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deleted) {
      return NextResponse.json({ error: "Brand kit not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Brand kit deleted" });
  } catch (error) {
    console.error("Error deleting brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

