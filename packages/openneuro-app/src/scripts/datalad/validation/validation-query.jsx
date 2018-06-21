import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../common/partials/spinner.jsx'
import ValidationStatus from './validation-status.jsx'

const getDatasetIssues = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        issues {
          severity
          code
          reason
          files {
            evidence
            line
            character
            reason
            file {
              name
              path
              relativePath
            }
          }
          additionalFileCount
        }
      }
    }
  }
`

const ValidationQuery = ({ datasetId }) => (
  <Query query={getDatasetIssues} variables={{ datasetId }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Spinner text="Loading" active />
      } else if (error) {
        throw new Error(error)
      } else {
        let issues =
          data.dataset && data.dataset.draft ? data.dataset.draft.issues : []
        let datasetId = data.dataset ? data.dataset.id : null
        return <ValidationStatus issues={issues} datasetId={datasetId} />
      }
    }}
  </Query>
)

ValidationQuery.propTypes = {
  datasetId: PropTypes.string,
}

export default ValidationQuery
