import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../common/partials/spinner.jsx'
import DatasetPage from './dataset-page.jsx'

const getDatasetPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      label
      created
      public
      uploader {
        id
        firstName
        lastName
        email
      }
      draft {
        modified
        files {
          id
          filename
          size
        }
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
      }
      snapshots {
        id
        tag
      }
    }
  }
`

const DataLadDataset = ({ match }) => (
  <Query
    query={getDatasetPage}
    variables={{ datasetId: match.params.datasetId }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Spinner />
      } else if (error) {
        // TODO - Throw an error for the error boundary
        console.log(error)
      } else {
        return <DatasetPage dataset={data.dataset} />
      }
    }}
  </Query>
)

export default DataLadDataset
