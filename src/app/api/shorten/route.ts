import { NextResponse } from "next/server";
import { urlStorage } from "@/lib/storage";
import { generateKey } from "@/lib/key-gen";
import { isValidUrl, normalizeUrl } from "@/lib/url-utils";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Normalize the URL to ensure consistent keys
    const normalizedUrl = normalizeUrl(url);

    // Generate deterministic key based on the normalized URL
    const code = generateKey(normalizedUrl);

    // Check if URL already exists
    const existingUrl = await urlStorage.get(code);
    if (existingUrl === normalizedUrl) {
      // URL already shortened, return existing code
      const shortUrl = `${request.headers.get("host")}/${code}`;
      return NextResponse.json({ shortUrl });
    }

    // Store the URL if it's new
    await urlStorage.set(code, normalizedUrl);

    // Return the shortened URL
    const shortUrl = `${request.headers.get("host")}/${code}`;
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
}
