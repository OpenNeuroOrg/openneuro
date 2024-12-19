
/**
 * Validates an ORCID.
 * @param orcid - The ORCID string to validate.
 * @returns `true` if the ORCID is valid, `false` otherwise.
 */
export function isValidOrcid(orcid: string): boolean {
  return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || '');
}