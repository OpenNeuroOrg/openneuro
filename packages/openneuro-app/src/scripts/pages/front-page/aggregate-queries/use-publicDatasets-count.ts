import { gql, useQuery } from "@apollo/client"

const PUBLIC_DATASETS_COUNT = gql`
  query publicDatasetCount($modality: String) {
    datasets(filterBy: { public: true }, modality: $modality) {
      pageInfo {
        count
      }
    }
  }
`

const BRAIN_INITIATIVE_COUNT = gql`
  query AdvancedSearch($query: JSON!, $datasetType: String!) {
    advancedSearch(query: $query, datasetType: $datasetType) {
      pageInfo {
        count
      }
    }
  }
`

const usePublicDatasetsCount = (modality?: string) => {
  const isNIH = modality === "nih"

  const query = isNIH ? BRAIN_INITIATIVE_COUNT : PUBLIC_DATASETS_COUNT
  const variables = isNIH
    ? {
      query: {
        bool: { filter: [{ match: { brainInitiative: { query: "true" } } }] },
      },
      datasetType: "public",
    }
    : { modality }

  return useQuery(query, {
    variables,
    errorPolicy: "all",
  })
}

export default usePublicDatasetsCount
