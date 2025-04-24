import { NextResponse } from "next/server";
import { urlStorage } from "@/lib/storage";

// This endpoint should be called by a cron job every day
export async function POST(request: Request) {
  try {
    // Verify the request is authorized (you should replace this with your actual auth check)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.CLEANUP_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await urlStorage.cleanupExpiredUrls();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cleaning up expired URLs:", error);
    return NextResponse.json(
      { error: "Failed to clean up expired URLs" },
      { status: 500 }
    );
  }
}
