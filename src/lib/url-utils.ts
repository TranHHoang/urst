/**
 * Validates and normalizes a URL.
 * @param url The URL to validate
 * @returns true if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  const normalizedUrl = url.trim();

  try {
    // Try parsing as is first
    new URL(normalizedUrl);
    return true;
  } catch {
    // If parsing fails, try adding https://
    try {
      new URL(`https://${normalizedUrl}`);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Normalizes a URL by ensuring it has a proper protocol.
 * @param url The URL to normalize
 * @returns The normalized URL
 * @throws Error if the URL is invalid
 */
export function normalizeUrl(url: string): string {
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
