import * as Sentry from "@sentry/react"

/**
 * Validates an ORCID.
 * @param orcid - The ORCID string to validate.
 * @returns `true` if the ORCID is valid, `false` otherwise.
 */
export function isValidOrcid(orcid: string): boolean {
  return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || "")
}

/**
 * Validates if a given string is a valid HTTP or HTTPS URL.
 * @param url - The URL string to validate.
 * @returns `true` if the URL is valid (http/https), `false` otherwise.
 */
export const validateHttpHttpsUrl = (url: string): boolean => {
  if (!url) {
    return false // Empty string is not a valid URL
  }
  try {
    const parsedUrl = new URL(url)
    // Check if the protocol is either http: or https:
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
  } catch (error) {
    // If new URL() throws an error, the string is not a valid URL
    Sentry.captureException(error) // Capture the error with Sentry
    return false
  }
}
