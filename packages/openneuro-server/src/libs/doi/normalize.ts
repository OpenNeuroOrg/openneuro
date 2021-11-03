// See https://www.crossref.org/blog/dois-and-matching-regular-expressions/
const DOIPattern = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i

export const normalizeDOI = (doi: string): string | null => {
  // Raw DOI
  if (doi.match(DOIPattern)) {
    return doi
  }
  if (doi.toLowerCase().startsWith('doi:') && doi.slice(4).match(DOIPattern)) {
    return doi.slice(4)
  }
  if (
    doi.toLowerCase().startsWith('https://doi.org/') &&
    doi.slice(16).match(DOIPattern)
  ) {
    return doi.slice(16)
  }

  return null
}
