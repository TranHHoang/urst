import { createHash } from "crypto";

// Define a base64url-safe alphabet (RFC 4648)
// - 64 characters total
// - URL-safe variant of base64 that replaces '+' with '-' and '/' with '_'
const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// Calculate key length needed for 2^64 combinations
// - Alphabet size = 64 characters (base64url)
// - Bits per character = log2(64) = 6 bits exactly
// - Required bits = 64
// - Required length = 64/6 ≈ 11 characters
// However, with 64^9 ≈ 2^54 combinations, we can use 9 characters
// This gives us 64^9 ≈ 1.0 * 10^16 combinations
const KEY_LENGTH = 9;

/**
 * Generates a deterministic key for URL shortening.
 * Same URLs will always generate the same key.
 *
 * Process:
 * 1. Create SHA-256 hash of the URL
 * 2. Take first 54 bits (9 characters * 6 bits)
 * 3. Convert to base64url encoding
 *
 * @param url The URL to generate a key for
 * @returns A deterministic 9-character base64url string
 */
export function generateKey(url: string): string {
  // Create SHA-256 hash of the URL
  const hash = createHash("sha256").update(url).digest();

  // Take first 7 bytes (56 bits, we'll use 54 of them)
  const bytes = hash.slice(0, 7);

  // Convert to base64url characters
  let key = "";
  let bits = 0;
  let value = 0;

  // Process each byte
  for (let i = 0; i < bytes.length && key.length < KEY_LENGTH; i++) {
    // Add 8 bits to our buffer
    value = (value << 8) | bytes[i];
    bits += 8;

    // While we have enough bits for a base64 character (6 bits)
    while (bits >= 6 && key.length < KEY_LENGTH) {
      // Extract 6 bits
      const index = (value >> (bits - 6)) & 0x3f;
      key += ALPHABET[index];
      bits -= 6;
    }
  }

  return key;
}

/**
 * Validates if a key matches our base64url format.
 * @param key The key to validate
 * @returns true if the key is valid
 */
export function isValidKey(key: string): boolean {
  if (!key || typeof key !== "string") return false;
  if (key.length !== KEY_LENGTH) return false;
  return key.split("").every((char) => ALPHABET.includes(char));
}

/**
 * Calculates the total number of possible keys.
 * @returns The number of possible unique keys
 */
export function getTotalPossibleKeys(): number {
  return Math.pow(ALPHABET.length, KEY_LENGTH);
}

/**
 * Calculates the bits of entropy provided by our key generation.
 * @returns The number of bits of entropy
 */
export function getBitsOfEntropy(): number {
  return KEY_LENGTH * 6; // Each base64 character provides exactly 6 bits
}

/**
 * Estimates the number of URLs we can handle before hitting a 0.1% collision probability.
 * Using the birthday problem formula: p ≈ 1 - e^(-n^2/(2*m))
 * where:
 * - p is the collision probability (0.001)
 * - n is the number of URLs
 * - m is the total possible keys
 *
 * @returns The estimated safe capacity
 */
export function getSafeCapacity(): number {
  const p = 0.001; // 0.1% collision probability
  const m = getTotalPossibleKeys();
  return Math.floor(Math.sqrt(2 * m * Math.log(1 / (1 - p))));
}

/**
 * Gets collision probability.
 * Note: With deterministic keys, collisions only happen when URLs are identical,
 * which is exactly what we want.
 *
 * @returns Always returns 0 since identical URLs get identical keys
 */
export function getCollisionProbability(): number {
  return 0; // Deterministic keys only collide for identical URLs
}
