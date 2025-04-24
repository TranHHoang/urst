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
  const originalUrl = await urlStorage.get(code);

  if (!originalUrl) {
    return;
  }

  // Ensure URL has a protocol
  let redirectUrl = originalUrl;
  try {
    new URL(redirectUrl);
  } catch {
    redirectUrl = `https://${redirectUrl}`;
  }

  return NextResponse.redirect(redirectUrl, { status: 301 });
}
