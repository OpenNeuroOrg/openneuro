import type { Contributor, RawDataciteContributor } from "../types/datacite"

export const mapToRawContributor = (
  c: Contributor,
): RawDataciteContributor => ({
  name: c.name,
  nameType: "Personal",
  contributorType: c.contributorType || "Researcher",
  givenName: c.givenName,
  familyName: c.familyName,
  nameIdentifiers: c.orcid
    ? [
      {
        nameIdentifier: c.orcid,
        nameIdentifierScheme: "ORCID",
        schemeUri: "https://orcid.org",
      },
    ]
    : undefined,
  affiliation: [],
})
