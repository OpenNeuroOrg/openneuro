export function validateOrcid(
  identifier: string | undefined | null,
): string | undefined {
  if (!identifier || typeof identifier !== "string") {
    return undefined
  }
  // This regex specifically targets the 16-digit ORCID number pattern.
  const orcidRegex = /([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X])/i
  const match = identifier.match(orcidRegex)

  if (match && match[1]) {
    // match[1] contains the actual ORCID number (e.g., "0000-0001-2345-6789")
    return match[1]
  }

  return undefined // No valid ORCID pattern found
}
