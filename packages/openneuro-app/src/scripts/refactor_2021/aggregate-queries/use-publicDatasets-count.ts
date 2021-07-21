import { gql, useQuery } from '@apollo/client'

const PUBLIC_DATASETS_COUNT = gql`
  query publicDatasetCount($modality: String) {
    datasets(filterBy: { public: true }, modality: $modality) {
      pageInfo {
        count
      }
    }
  }
`

const usePublicDatasetsCount = (modality?: string) => {
  return useQuery(PUBLIC_DATASETS_COUNT, {
    variables: { modality },
    errorPolicy: 'all',
  })
}

export default usePublicDatasetsCount
