import { NextResponse } from "next/server";
import { urlStorage } from "@/lib/storage";
import { generateKey } from "@/lib/key-gen";
import { isValidUrl, normalizeUrl } from "@/lib/url-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || undefined;

    if (!url || !isValidUrl(url)) {
      console.log("Invalid URL:", url);
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Normalize the URL to ensure consistent keys
    const normalizedUrl = normalizeUrl(url);
    console.log("Normalized URL:", normalizedUrl);

    // Generate deterministic key based on the normalized URL
    const code = generateKey(normalizedUrl);
    console.log("Generated code:", code);

    try {
      // Check if URL already exists using getUrlData instead of get
      const existingUrlData = await urlStorage.getUrlData(code);
      console.log("Existing URL data:", existingUrlData);

      if (existingUrlData?.original_url === normalizedUrl) {
        // URL already shortened, return existing code
        const shortUrl = `${request.headers.get("host")}/${code}`;
        return NextResponse.json({
          shortUrl,
          isAuthenticated: !!session,
          expiresAt: existingUrlData.expires_at || null,
        });
      }

      // If we get here, either:
      // 1. No URL exists with this code
      // 2. A different URL exists with this code (collision, extremely rare)
      // In either case, we should try to store with a new code
      let newCode = code;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          await urlStorage.set(newCode, normalizedUrl, userId);
          // If successful, break out of the loop
          break;
        } catch (error: unknown) {
          const dbError = error as { code?: string };
          if (dbError?.code === "23505" && attempts < maxAttempts - 1) {
            // If it's a duplicate key and we haven't exceeded attempts,
            // generate a new code by adding a counter to the URL
            newCode = generateKey(`${normalizedUrl}#${attempts + 1}`);
            attempts++;
            continue;
          }
          // If it's not a duplicate key error or we're out of attempts, rethrow
          throw error;
        }
      }

      // Return the shortened URL
      const shortUrl = `${request.headers.get("host")}/${newCode}`;
      return NextResponse.json({
        shortUrl,
        isAuthenticated: !!session,
        expiresAt: session
          ? null
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (storageError) {
      console.error("Storage error:", storageError);
      throw storageError;
    }
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
}
