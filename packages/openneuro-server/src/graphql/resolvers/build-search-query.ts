/**
 * Translate DatasetSearchInput into ElasticSearch Query DSL
 *
 * Port of query building logic from the React side
 */

interface DatasetSearchInput {
  keywords?: string[]
  modality?: string
  ageRange?: (number | null)[]
  subjectCountRange?: (number | null)[]
  diagnosis?: string
  tasks?: string[]
  authors?: string[]
  sex?: string
  dateRange?: string
  species?: string
  studyStructure?: string
  studyDomains?: string[]
  bidsDatasetType?: string
  brainInitiative?: boolean
  bodyParts?: string[]
  scannerManufacturers?: string[]
  scannerManufacturersModelNames?: string[]
  tracerNames?: string[]
  tracerRadionuclides?: string[]
  userId?: string
  publicOnly?: boolean
}

const KNOWN_SPECIES = ["Human", "Rat", "Mouse"]

const SECONDARY_MODALITIES: Record<
  string,
  { secondary: string; primary: string }
> = {
  Diffusion: { secondary: "mri_diffusion", primary: "mri" },
  Structural: { secondary: "mri_structural", primary: "mri" },
  Functional: { secondary: "mri_functional", primary: "mri" },
  Perfusion: { secondary: "mri_perfusion", primary: "mri" },
  Static: { secondary: "pet_static", primary: "pet" },
  Dynamic: { secondary: "pet_dynamic", primary: "pet" },
}

interface BoolQuery {
  bool: {
    must?: object[]
    filter?: object[]
    must_not?: object[]
    should?: object[]
  }
}

const addClause = (
  query: BoolQuery,
  type: "must" | "filter" | "must_not" | "should",
  clause: object,
) => {
  if (query.bool[type]) {
    query.bool[type] = [...query.bool[type], clause]
  } else {
    query.bool[type] = [clause]
  }
}

const simpleQueryString = (
  queryString: string,
  fields?: string[],
  fuzzy = true,
) => ({
  simple_query_string: {
    query: `${queryString}${fuzzy ? "~" : ""}`,
    fields,
  },
})

const matchQuery = (
  field: string,
  queryString: string,
  fuzziness?: string,
  operator?: string,
) => ({
  match: {
    [field]: {
      query: queryString,
      fuzziness,
      operator,
    },
  },
})

const multiMatchQuery = (field: string, queryStrings: string[]) => ({
  bool: {
    should: queryStrings.map((qs) => matchQuery(field, qs)),
    minimum_should_match: 1,
  },
})

const rangeQuery = (
  field: string,
  gte?: number | string | null,
  lte?: number | string | null,
  relation: string = "INTERSECTS",
) => ({
  range: {
    [field]: {
      gte,
      lte,
      relation,
    },
  },
})

const rangeListLengthQuery = (field: string, gte: number, lte: number) => ({
  script: {
    script: {
      lang: "painless",
      source: `
          if (doc[params.field].size() != 0) {
            return ( doc[params.field].size() >= params.gte && doc[params.field].size() <= params.lte )
          } else return false`,
      params: { field, gte, lte },
    },
  },
})

const sqsJoinWithAND = (list: string[]) =>
  list.map((str) => `${str}`).join(" + ")
const joinWithOR = (list: string[]) => list.map((str) => `${str}`).join(" | ")

const isActiveRange = (range: (number | null)[] | undefined): boolean =>
  Array.isArray(range) &&
  range.length === 2 &&
  (range[0] !== null || range[1] !== null)

/**
 * Build an ElasticSearch bool query from structured search input.
 * Returns { query, isEmpty } where query is the ES Query DSL object.
 */
export const buildElasticQuery = (
  input: DatasetSearchInput,
): { query: BoolQuery; isEmpty: boolean } => {
  const query: BoolQuery = { bool: {} }

  if (input.keywords?.length) {
    addClause(
      query,
      "must",
      simpleQueryString(sqsJoinWithAND(input.keywords), [
        "id^20",
        "latestSnapshot.readme",
        "latestSnapshot.description.Name^6",
        "latestSnapshot.description.Authors^3",
        "latestSnapshot.contributors.name^2",
      ]),
    )
  }

  if (input.modality) {
    if (SECONDARY_MODALITIES[input.modality]) {
      addClause(
        query,
        "filter",
        matchQuery(
          "latestSnapshot.summary.secondaryModalities",
          SECONDARY_MODALITIES[input.modality].secondary,
        ),
      )
    } else {
      addClause(
        query,
        "filter",
        matchQuery("latestSnapshot.summary.modalities", input.modality),
      )
    }
  }

  if (isActiveRange(input.ageRange)) {
    addClause(
      query,
      "filter",
      rangeQuery(
        "latestSnapshot.summary.subjectMetadata.age",
        input.ageRange[0],
        input.ageRange[1],
      ),
    )
  }

  if (isActiveRange(input.subjectCountRange)) {
    addClause(
      query,
      "filter",
      rangeListLengthQuery(
        "latestSnapshot.summary.subjects",
        input.subjectCountRange[0] || 0,
        input.subjectCountRange[1] || 1000000,
      ),
    )
  }

  if (input.diagnosis) {
    addClause(
      query,
      "filter",
      matchQuery("metadata.dxStatus", input.diagnosis),
    )
  }

  if (input.bidsDatasetType) {
    addClause(
      query,
      "filter",
      matchQuery(
        "latestSnapshot.description.DatasetType",
        input.bidsDatasetType,
      ),
    )
  }

  if (input.brainInitiative) {
    addClause(
      query,
      "filter",
      matchQuery("brainInitiative", String(input.brainInitiative)),
    )
  }

  if (input.tasks?.length) {
    addClause(
      query,
      "must",
      simpleQueryString(sqsJoinWithAND(input.tasks), [
        "latestSnapshot.summary.tasks",
      ]),
    )
  }

  if (input.authors?.length) {
    const authorQuery = matchQuery(
      "latestSnapshot.contributors.name",
      joinWithOR(input.authors),
      "2",
    )
    addClause(query, "must", {
      bool: {
        should: [authorQuery],
      },
    })
  }

  if (input.sex && input.sex !== "All") {
    let queryStrings: string[] = []
    if (input.sex === "Male") {
      queryStrings = ["male", "m", "M", "MALE", "Male"]
    } else if (input.sex === "Female") {
      queryStrings = ["female", "f", "F", "FEMALE", "Female"]
    }
    addClause(
      query,
      "filter",
      multiMatchQuery(
        "latestSnapshot.summary.subjectMetadata.sex",
        queryStrings,
      ),
    )
  }

  if (input.dateRange && input.dateRange !== "All Time") {
    let d: number
    if (input.dateRange === "Last 30 days") {
      d = 30
    } else if (input.dateRange === "Last 180 days") {
      d = 180
    } else {
      d = 365
    }
    addClause(query, "filter", rangeQuery("created", `now-${d}d/d`, "now/d"))
  }

  if (input.species) {
    if (input.species === "Other") {
      const species = KNOWN_SPECIES.join(" ")
      addClause(
        query,
        "must_not",
        matchQuery("metadata.species", species, "AUTO", "OR"),
      )
    } else if (input.species === "Human") {
      query.bool["should"] = [
        matchQuery("metadata.species", "Human", "AUTO"),
        { term: { _content: "" } },
      ]
    } else {
      addClause(
        query,
        "filter",
        matchQuery("metadata.species", input.species, "AUTO"),
      )
    }
  }

  if (input.studyStructure) {
    addClause(
      query,
      "filter",
      matchQuery("metadata.studyLongitudinal", input.studyStructure, "AUTO"),
    )
  }

  if (input.studyDomains?.length) {
    addClause(
      query,
      "must",
      matchQuery("metadata.studyDomain", joinWithOR(input.studyDomains)),
    )
  }

  // PET-specific fields (only apply when modality is pet or unset)
  if (
    input.modality === "pet" || input.modality === null ||
    input.modality === undefined
  ) {
    if (input.bodyParts?.length) {
      addClause(
        query,
        "must",
        simpleQueryString(sqsJoinWithAND(input.bodyParts), [
          "latestSnapshot.summary.pet.BodyPart",
        ]),
      )
    }
    if (input.scannerManufacturers?.length) {
      addClause(
        query,
        "must",
        simpleQueryString(sqsJoinWithAND(input.scannerManufacturers), [
          "latestSnapshot.summary.pet.ScannerManufacturer",
        ]),
      )
    }
    if (input.scannerManufacturersModelNames?.length) {
      addClause(
        query,
        "must",
        simpleQueryString(
          sqsJoinWithAND(input.scannerManufacturersModelNames),
          [
            "latestSnapshot.summary.pet.ScannerManufacturersModelName",
          ],
        ),
      )
    }
    if (input.tracerNames?.length) {
      addClause(
        query,
        "must",
        simpleQueryString(sqsJoinWithAND(input.tracerNames), [
          "latestSnapshot.summary.pet.TracerName",
        ]),
      )
    }
    if (input.tracerRadionuclides?.length) {
      addClause(
        query,
        "must",
        simpleQueryString(sqsJoinWithAND(input.tracerRadionuclides), [
          "latestSnapshot.summary.pet.TracerRadionuclide",
        ]),
      )
    }
  }

  if (input.userId) {
    addClause(query, "filter", {
      terms: {
        "permissions.userPermissions.user.id": [input.userId],
      },
    })
  }

  if (input.publicOnly) {
    addClause(query, "filter", {
      term: { public: { value: true } },
    })
  }

  const isEmpty = Object.keys(query.bool).length === 0

  return { query, isEmpty }
}
