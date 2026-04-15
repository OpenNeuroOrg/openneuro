import { useContext } from "react"
import { gql, useQuery } from "@apollo/client"
import { SearchParamsCtx } from "./search-params-ctx"

const searchQuery = gql`
  query advancedSearchDatasets(
    $query: DatasetSearchInput!
    $cursor: String
    $allDatasets: Boolean
    $datasetType: String
    $datasetStatus: String
  ) {
    datasets: advancedSearch(
      query: $query
      allDatasets: $allDatasets
      datasetType: $datasetType
      datasetStatus: $datasetStatus
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

const isActiveRange = (range: (number | null)[]): boolean =>
  range[0] !== null || range[1] !== null

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

  // Build the structured search input
  const query: Record<string, unknown> = {}

  if (keywords.length) query.keywords = keywords
  if (modality_selected) query.modality = modality_selected
  if (isActiveRange(ageRange)) query.ageRange = ageRange
  if (isActiveRange(subjectCountRange)) {
    query.subjectCountRange = subjectCountRange
  }
  if (diagnosis_selected) query.diagnosis = diagnosis_selected
  if (tasks.length) query.tasks = tasks
  if (authors.length) query.authors = authors
  if (sex_selected && sex_selected !== "All") query.sex = sex_selected
  if (date_selected && date_selected !== "All Time") {
    query.dateRange = date_selected
  }
  if (species_selected) query.species = species_selected
  if (section_selected) query.studyStructure = section_selected
  if (studyDomains.length) query.studyDomains = studyDomains
  if (bidsDatasetType_selected) query.bidsDatasetType = bidsDatasetType_selected
  if (brain_initiative) query.brainInitiative = true
  if (bodyParts.length) query.bodyParts = bodyParts
  if (scannerManufacturers.length) {
    query.scannerManufacturers = scannerManufacturers
  }
  if (scannerManufacturersModelNames.length) {
    query.scannerManufacturersModelNames = scannerManufacturersModelNames
  }
  if (tracerNames.length) query.tracerNames = tracerNames
  if (tracerRadionuclides.length) {
    query.tracerRadionuclides = tracerRadionuclides
  }
  if (sortBy_selected) query.sortBy = sortBy_selected.value

  return useQuery(searchQuery, {
    variables: {
      query,
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
