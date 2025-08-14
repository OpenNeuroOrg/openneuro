import { useContext } from "react"
import { gql, useQuery } from "@apollo/client"
import { SearchParamsCtx } from "./search-params-ctx"
import initialSearchParams from "./initial-search-params"
import {
  BoolQuery,
  joinWithOR,
  matchQuery,
  multiMatchQuery,
  rangeListLengthQuery,
  rangeQuery,
  simpleQueryString,
  sqsJoinWithAND,
} from "./es-query-builders"

const searchQuery = gql`
  query advancedSearchDatasets(
    $query: JSON!
    $cursor: String
    $allDatasets: Boolean
    $datasetType: String
    $datasetStatus: String
    $sortBy: JSON
  ) {
    datasets: advancedSearch(
      query: $query
      allDatasets: $allDatasets
      datasetType: $datasetType
      datasetStatus: $datasetStatus
      sortBy: $sortBy
      first: 25
      after: $cursor
    ) {
      edges {
        id
        node {
          id
          created
          uploader {
            id
            name
            orcid
          }
          public
          permissions {
            id
            userPermissions {
              userId
              level
              access: level
              user {
                id
                name
                email
                provider
              }
            }
          }
          metadata {
            ages
          }
          latestSnapshot {
            size
            readme
            summary {
              modalities
              primaryModality
              secondaryModalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
              pet {
                BodyPart
                ScannerManufacturer
                ScannerManufacturersModelName
                TracerName
                TracerRadionuclide
              }
            }
            issues {
              severity
            }
            validation {
              errors
              warnings
            }
            description {
              Name
              Authors
              DatasetDOI
            }
            creators {
              name
              givenName 
              familyName 
              orcid 
            }
            contributors {
              name
              givenName 
              familyName 
              orcid 
              contributorType
            }
          }
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`

const isActiveRange = (range) =>
  JSON.stringify(range) !== JSON.stringify([null, null])

export const useSearchResults = () => {
  const { searchParams } = useContext(SearchParamsCtx)
  const {
    keywords,
    searchAllDatasets,
    datasetType_selected,
    datasetStatus_selected,
    modality_selected,
    ageRange,
    subjectCountRange,
    diagnosis_selected,
    tasks,
    authors,
    sex_selected,
    date_selected,
    species_selected,
    section_selected,
    studyDomains,
    bodyParts,
    scannerManufacturers,
    scannerManufacturersModelNames,
    tracerNames,
    tracerRadionuclides,
    sortBy_selected,
    bidsDatasetType_selected,
    brain_initiative,
  } = searchParams

  const boolQuery = new BoolQuery()
  if (keywords.length) {
    boolQuery.addClause(
      "must",
      simpleQueryString(sqsJoinWithAND(keywords), [
        "id^20",
        "latestSnapshot.readme",
        "latestSnapshot.description.Name^6",
        "latestSnapshot.description.Authors^3", // TODO: Nell - do we need this still?
        "latestSnapshot.creators.name^3",
        "latestSnapshot.contributors.name^2",
      ]),
    )
  }
  if (modality_selected) {
    const secondaryModalities = {
      Diffusion: {
        secondary: "mri_diffusion",
        primary: "mri",
      },
      Structural: {
        secondary: "mri_structural",
        primary: "mri",
      },
      Functional: {
        secondary: "mri_functional",
        primary: "mri",
      },
      Perfusion: {
        secondary: "mri_perfusion",
        primary: "mri",
      },
      Static: {
        secondary: "pet_static",
        primary: "pet",
      },
      Dynamic: {
        secondary: "pet_dynamic",
        primary: "pet",
      },
    }
    if (Object.keys(secondaryModalities).includes(modality_selected)) {
      boolQuery.addClause(
        "filter",
        matchQuery(
          "latestSnapshot.summary.secondaryModalities",
          secondaryModalities[modality_selected].secondary,
        ),
      )
    } else {
      boolQuery.addClause(
        "filter",
        matchQuery("latestSnapshot.summary.modalities", modality_selected),
      )
    }
  }

  if (isActiveRange(ageRange)) {
    boolQuery.addClause(
      "filter",
      rangeQuery("latestSnapshot.summary.subjectMetadata.age", ...ageRange),
    )
  }
  if (isActiveRange(subjectCountRange)) {
    boolQuery.addClause(
      "filter",
      rangeListLengthQuery(
        "latestSnapshot.summary.subjects",
        subjectCountRange[0] || 0,
        subjectCountRange[1] || 1000000,
      ),
    )
  }
  if (diagnosis_selected) {
    boolQuery.addClause(
      "filter",
      matchQuery("metadata.dxStatus", diagnosis_selected),
    )
  }
  if (bidsDatasetType_selected) {
    boolQuery.addClause(
      "filter",
      matchQuery(
        "latestSnapshot.description.DatasetType",
        bidsDatasetType_selected,
      ),
    )
  }
  if (brain_initiative) {
    boolQuery.addClause(
      "filter",
      matchQuery(
        "brainInitiative",
        brain_initiative,
      ),
    )
  }
  if (tasks.length) {
    boolQuery.addClause(
      "must",
      simpleQueryString(sqsJoinWithAND(tasks), [
        "latestSnapshot.summary.tasks",
      ]),
    )
  }
  if (authors.length) { // TODO - NELL - this was switched to creators - is that correct?
    const authorQuery = matchQuery(
      "latestSnapshot.creators.name",
      joinWithOR(authors),
      "2",
    )
    const contributorQuery = matchQuery(
      "latestSnapshot.contributors.name",
      joinWithOR(authors),
      "2",
    )
    boolQuery.addClause(
      "must",
      {
        bool: {
          should: [authorQuery, contributorQuery],
        },
      },
    )
  }
  if (sex_selected !== "All") {
    // Possible values for this field are specified here:
    // https://bids-specification.readthedocs.io/en/stable/glossary.html#objects.columns.sex
    let queryStrings = []
    if (sex_selected == "Male") {
      queryStrings = ["male", "m", "M", "MALE", "Male"]
    } else if (sex_selected == "Female") {
      queryStrings = ["female", "f", "F", "FEMALE", "Female"]
    }
    boolQuery.addClause(
      "filter",
      multiMatchQuery(
        "latestSnapshot.summary.subjectMetadata.sex",
        queryStrings,
      ),
    )
  }
  if (date_selected !== "All Time") {
    let d: number
    if (date_selected === "Last 30 days") {
      d = 30
    } else if (date_selected === "Last 180 days") {
      d = 180
    } else {
      d = 365
    }
    boolQuery.addClause("filter", rangeQuery("created", `now-${d}d/d`, "now/d"))
  }
  if (species_selected) {
    if (species_selected === "Other") {
      // if species is 'Other', search for every species that isn't an available option
      const species = initialSearchParams.species_available
        .filter((s) => s !== "Other")
        .join(" ")
      boolQuery.addClause(
        "must_not",
        matchQuery("metadata.species", species, "AUTO", "OR"),
      )
    } else if (species_selected === "Human") {
      // if species is 'Human', search for Human or null values (BIDS assumes human by default)
      boolQuery.query.bool["should"] = [
        matchQuery("metadata.species", "Human", "AUTO"),
        { term: { _content: "" } },
      ]
    } else {
      boolQuery.addClause(
        "filter",
        matchQuery("metadata.species", species_selected, "AUTO"),
      )
    }
  }
  if (section_selected) {
    boolQuery.addClause(
      "filter",
      matchQuery("metadata.studyLongitudinal", section_selected, "AUTO"),
    )
  }
  if (studyDomains.length) {
    boolQuery.addClause(
      "must",
      matchQuery("metadata.studyDomain", joinWithOR(studyDomains)),
    )
  }
  if (modality_selected === "pet" || modality_selected === null) {
    if (bodyParts.length) {
      boolQuery.addClause(
        "must",
        simpleQueryString(sqsJoinWithAND(bodyParts), [
          "latestSnapshot.summary.pet.BodyPart",
        ]),
      )
    }
    if (scannerManufacturers.length) {
      boolQuery.addClause(
        "must",
        simpleQueryString(sqsJoinWithAND(scannerManufacturers), [
          "latestSnapshot.summary.pet.ScannerManufacturer",
        ]),
      )
    }
    if (scannerManufacturersModelNames.length) {
      boolQuery.addClause(
        "must",
        simpleQueryString(sqsJoinWithAND(scannerManufacturersModelNames), [
          "latestSnapshot.summary.pet.ScannerManufacturersModelName",
        ]),
      )
    }
    if (tracerNames.length) {
      boolQuery.addClause(
        "must",
        simpleQueryString(sqsJoinWithAND(tracerNames), [
          "latestSnapshot.summary.pet.TracerName",
        ]),
      )
    }
    if (tracerRadionuclides.length) {
      boolQuery.addClause(
        "must",
        simpleQueryString(sqsJoinWithAND(tracerRadionuclides), [
          "latestSnapshot.summary.pet.TracerRadionuclide",
        ]),
      )
    }
  }

  let sortBy
  if (sortBy_selected.label === "Relevance") {
    // If filters are set, sort by relevance (default sort),
    //   otherwise, sort from newest to oldest
    sortBy = boolQuery.isEmpty() ? { created: "desc" } : null
  } else if (sortBy_selected.label === "Newest") {
    sortBy = { created: "desc" }
  } else if (sortBy_selected.label === "Oldest") {
    sortBy = { created: "asc" }
  } else if (sortBy_selected.label === "Activity") {
    // TODO: figure out
    sortBy = { "analytics.downloads": "desc" }
  }
  return useQuery(searchQuery, {
    variables: {
      query: boolQuery.get(),
      sortBy,
      allDatasets: searchAllDatasets,
      datasetType: datasetType_selected,
      datasetStatus: datasetStatus_selected,
    },
    errorPolicy: "ignore",
    // fetchPolicy is workaround for stuck loading bug (https://github.com/apollographql/react-apollo/issues/3270#issuecomment-579614837)
    // TODO: find better solution
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  })
}
