/**
 * Interfaces for working with datacite.yml metadata.
 * Both contributors and creators
 */

/**
 * Unique identifier for a person or organization.
 */
export interface NameIdentifier {
  nameIdentifier: string
  nameIdentifierScheme: string
  schemeUri?: string
}

/**
 * An interface for an organizational or institutional affiliation.
 */
export interface Affiliation {
  name: string
  schemeUri?: string
  affiliationIdentifier?: string
  affiliationIdentifierScheme?: string
}

/**
 * Contributor object (normalized form used internally in app).
 */
export interface Contributor {
  name: string
  givenName?: string
  familyName?: string
  orcid?: string
  contributorType?: string
  order?: number
  userId?: string
}

/**
 * Base interface shared by both creators and contributors in datacite.yml
 */
export interface RawDataciteBaseContributor {
  name: string
  nameType: "Personal" | "Organizational"
  givenName?: string
  familyName?: string
  nameIdentifiers?: NameIdentifier[]
  affiliation?: Affiliation[]
}

/**
 * Raw Creator object as it appears in datacite.yml creators array.
 * Does NOT have contributorType.
 */
export type RawDataciteCreator = RawDataciteBaseContributor

/**
 * Raw Contributor object as it appears in datacite.yml contributors array.
 * Adds contributorType, which is required.
 */
export interface RawDataciteContributor extends RawDataciteBaseContributor {
  contributorType: string
}

/**
 * An interface for the resource types.
 */
export interface RawDataciteTypes {
  resourceType?: string
  resourceTypeGeneral: string
}

/**
 * The main attributes section of the datacite.yml file.
 */
export interface RawDataciteAttributes {
  contributors?: RawDataciteContributor[]
  creators?: RawDataciteCreator[]
  types: RawDataciteTypes
}

/**
 * The top-level interface for the entire datacite.yml file structure.
 */
export interface RawDataciteYml {
  data: {
    attributes: RawDataciteAttributes
  }
}
