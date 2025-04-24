import { NextResponse } from "next/server";
import crypto from "crypto";
import { urlStorage } from "@/lib/storage";

function generateShortCode(): string {
  // Generate a random 6-character string
  return crypto.randomBytes(3).toString("hex");
}

function normalizeUrl(url: string): string {
  const normalizedUrl = url.trim();

  try {
    // Try parsing as is first
    new URL(normalizedUrl);
    return normalizedUrl;
  } catch {
    // If parsing fails, try adding https://
    try {
      new URL(`https://${normalizedUrl}`);
      return `https://${normalizedUrl}`;
    } catch {
      throw new Error("Invalid URL");
    }
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate and normalize URL
    let normalizedUrl;
    try {
      normalizedUrl = normalizeUrl(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Generate a unique short code
    let shortCode = generateShortCode();
    while (await urlStorage.has(shortCode)) {
      shortCode = generateShortCode();
    }

    // Store the URL mapping
    await urlStorage.set(shortCode, normalizedUrl);

    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";

    // Return the shortened URL
    return NextResponse.json({
      originalUrl: normalizedUrl,
      shortCode,
      shortUrl: `${protocol}://${host}/${shortCode}`,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
