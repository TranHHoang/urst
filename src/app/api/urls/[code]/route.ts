import { NextResponse } from "next/server";
import { urlStorage } from "@/lib/storage";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  try {
    const { code } = await params;
    const success = await urlStorage.delete(code);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete URL" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
