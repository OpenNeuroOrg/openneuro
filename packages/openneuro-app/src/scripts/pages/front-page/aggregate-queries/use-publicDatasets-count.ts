import { gql, useQuery } from "@apollo/client"

export const ADVANCED_SEARCH_COUNT = gql`
  query AdvancedSearch($query: DatasetSearchInput!, $datasetType: String!) {
    advancedSearch(query: $query, datasetType: $datasetType) {
      pageInfo {
        count
      }
    }
  }
`

const usePublicDatasetsCount = (modality?: string) => {
  const isNIH = modality === "nih"

  const variables = isNIH
    ? {
      query: { brainInitiative: true },
      datasetType: "All Public",
    }
    : {
      query: modality ? { modality } : {},
      datasetType: "All Public",
    }

  return useQuery(ADVANCED_SEARCH_COUNT, {
    variables,
    errorPolicy: "all",
  })
}

export default usePublicDatasetsCount
