import { NextResponse } from "next/server";
import { urlStorage } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || undefined;

    const recentUrls = await urlStorage.getRecentUrls(5, userId);
    return NextResponse.json(recentUrls);
  } catch (error) {
    console.error("Error fetching recent URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent URLs" },
      { status: 500 }
    );
  }
}
