/**
 * Test if a string is an HTTPS URL
 * @param value Text string to test for a URL
 * @returns {boolean} True if valid
 */
export function validateUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:"
  } catch (_err) {
    return false
  }
}
