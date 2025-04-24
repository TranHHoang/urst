import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { urlStorage } from "@/lib/storage";

export const config = {
  matcher: "/((?!api|_next|favicon.ico).*)",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip the home page
  if (pathname === "/") {
    return;
  }

  // Extract the code from the pathname
  const code = pathname.slice(1);

  try {
    // Get the URL data
    const urlData = await urlStorage.getUrlData(code);

    if (
      !urlData ||
      (urlData.expires_at && new Date(urlData.expires_at) < new Date())
    ) {
      // If URL doesn't exist or is expired, redirect to 404
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // Increment clicks in the background
    urlStorage.incrementClicks(code).catch((err) => {
      console.error("Error incrementing clicks:", err);
    });

    // Ensure URL has a protocol
    let redirectUrl = urlData.original_url;
    if (
      !redirectUrl.startsWith("http://") &&
      !redirectUrl.startsWith("https://")
    ) {
      redirectUrl = `https://${redirectUrl}`;
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}
