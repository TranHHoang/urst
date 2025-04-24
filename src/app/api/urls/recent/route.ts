import { NextResponse } from "next/server";
import { urlStorage } from "@/lib/storage";

export async function GET() {
  try {
    const recentUrls = await urlStorage.getRecentUrls(3);
    return NextResponse.json(recentUrls);
  } catch (error) {
    console.error("Error fetching recent URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent URLs" },
      { status: 500 }
    );
  }
}
