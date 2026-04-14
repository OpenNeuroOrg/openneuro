/**
 * DataCite types.
 *
 * Schema-derived types are re-exported from the generated datacite-v4.5 module.
 * Only app-specific types that don't exist in the DataCite schema are defined here.
 */

export type {
  Affiliation,
  ContributorType,
  Creator,
  DescriptionType,
  NameIdentifiers,
  NameType,
  Person,
  PublicationYear,
  ResourceTypeGeneral,
  TitleType,
} from "./datacite/datacite-v4.5"

export type { Contributor as DataciteContributor } from "./datacite/datacite-v4.5"

import type { Creator, DataCiteV45, TitleType } from "./datacite/datacite-v4.5"

/**
 * Re-export the versioned schema type under a version-agnostic name.
 *
 * Titles and creators are omitted and we separately check minItems:1
 */
export type DataCite = Omit<DataCiteV45, "creators" | "titles"> & {
  creators: Creator[]
  titles: {
    title: string
    titleType?: TitleType
    lang?: string
  }[]
}

/**
 * Internal app contributor type with fields not in the DataCite schema
 * (orcid shorthand, display order, linked user ID).
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
 * DOI states tracked in our database (response-only, not in the DataCite request schema).
 */
export type DoiState = "draft" | "registered" | "findable"

export interface DatasetWithDescription {
  dataset_description?: {
    Description?: string
  }
}

/**
 * The datacite.yml file structure stored in dataset repositories.
 * Uses a subset of DataCiteV45 fields wrapped in a JSON:API-like envelope.
 */
export interface RawDataciteYml {
  data: {
    attributes: Partial<
      Pick<
        DataCite,
        "contributors" | "creators" | "types" | "descriptions"
      >
    >
  }
}

/**
 * JSON:API request envelope for the DataCite REST API.
 */
export interface DataciteDoiRequest {
  data: {
    type: "dois"
    attributes: DataCite
  }
}
