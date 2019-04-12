import { getDatasetPage } from './dataset-query.jsx'

// Single place to define destructive dataset refetch queries
export const datasetQueryRefetch = datasetId => [
  { query: getDatasetPage, variables: { datasetId } },
]
