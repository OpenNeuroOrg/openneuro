import React from 'react'
import { Query } from '@apollo/client/react/components'
import gql from 'graphql-tag'

const PUBLIC_DATASET_COUNT = gql`
  query publicDatasetCount {
    datasets(filterBy: { public: true }) {
      pageInfo {
        count
      }
    }
  }
`

export const DatasetCountDisplay = ({ loading, data }) => {
  try {
    return loading ? null : data.datasets.pageInfo.count
  } catch (e) {
    return null
  }
}

const DatasetCount = () => (
  <Query query={PUBLIC_DATASET_COUNT} errorPolicy="ignore">
    {DatasetCountDisplay}
  </Query>
)

export default DatasetCount
