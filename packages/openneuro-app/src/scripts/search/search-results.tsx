import React from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { datasets } from '@openneuro/client'
import { datasetQueryDisplay } from '../datalad/dashboard/datasets/dataset-query.jsx'

/**
 * This component is responsible for obtaining results from Elastic based
 * on the URL string and forwarding the data to the dashboard component
 */
const SearchResultsQuery: React.FC = () => {
  const { query } = useParams()
  return datasetQueryDisplay(
    true,
    false,
  )(
    useQuery(datasets.searchDatasets, {
      variables: {
        q: query,
      },
      errorPolicy: 'ignore',
    }),
  )
}

export default SearchResultsQuery
