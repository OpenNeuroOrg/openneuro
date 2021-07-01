import { gql, useQuery } from '@apollo/client'

const PUBLIC_DATASETS_COUNT = gql`
  query publicDatasetCount {
    datasets(filterBy: { public: true }) {
      pageInfo {
        count
      }
    }
  }
`

const usePublicDatasetsCount = (label?: string) => {
  return useQuery(PUBLIC_DATASETS_COUNT, {
    variables: { label },
  })
}

export default usePublicDatasetsCount
