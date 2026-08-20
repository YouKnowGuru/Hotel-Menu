import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import UserSettings from "@/models/UserSettings";
import { settingsSchema } from "@/lib/validators/schemas";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    let settings = await UserSettings.findOne({ userId: session.user.id }).lean();

    if (!settings) {
      settings = await UserSettings.create({ userId: session.user.id });
      settings = settings.toObject();
    }

    // The model stores autoSaveInterval in milliseconds; expose it in seconds
    // so it round-trips with the settings schema/UI (5–300 seconds).
    const autoSaveIntervalSeconds =
      typeof settings.autoSaveInterval === "number" && settings.autoSaveInterval >= 1000
        ? Math.round(settings.autoSaveInterval / 1000)
        : settings.autoSaveInterval;

    return NextResponse.json({
      success: true,
      data: { ...settings, autoSaveInterval: autoSaveIntervalSeconds },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
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
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? `${issue.path.join(".") || "settings"}: ${issue.message}` : "Invalid settings" },
        { status: 400 }
      );
    }

    const { autoSaveInterval, ...rest } = parsed.data;
    const update: Record<string, unknown> = { ...rest };
    if (typeof autoSaveInterval === "number") {
      // UI/API speak seconds; the model stores milliseconds.
      update.autoSaveInterval = autoSaveInterval * 1000;
    }

    await connectToDatabase();
    const settings = await UserSettings.findOneAndUpdate(
      { userId: session.user.id },
      { ...update, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        autoSaveInterval:
          typeof settings?.autoSaveInterval === "number" && settings.autoSaveInterval >= 1000
            ? Math.round(settings.autoSaveInterval / 1000)
            : settings?.autoSaveInterval,
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
