export interface Creator {
  name?: string
  givenName?: string
  familyName?: string
  orcid?: string
}

export interface Contributor {
  name?: string
  givenName?: string
  familyName?: string
  orcid?: string
  contributorType?: string
  order?: number
}
