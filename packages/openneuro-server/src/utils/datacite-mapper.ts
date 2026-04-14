import type {
  Contributor,
  ContributorType,
  DataciteContributor,
} from "../types/datacite"

export const mapToRawContributor = (
  c: Contributor,
): DataciteContributor => ({
  name: c.name,
  nameType: "Personal",
  contributorType: (c.contributorType || "Researcher") as ContributorType,
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
