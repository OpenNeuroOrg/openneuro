import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

const GET_HISTORY = gql`
  query getHistory($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      history
      worker
    }
  }
`

const DatasetHistory = ({ datasetId }) => {
  const { loading, data } = useQuery(GET_HISTORY, {
    variables: { datasetId },
  })
  if (loading) {
    return <div className="dataset-history">Loading...</div>
  } else {
    return (
      <div className="dataset-history">
        <div className="col-xs-6">
          <h4>Worker Assignment</h4> {data.dataset.worker}
        </div>
        <div className="col-xs-12">
          <h4>Git History</h4>
          {data.dataset.history.map(row => (
            <div key={row}>{row}</div>
          ))}
        </div>
      </div>
    )
  }
}

DatasetHistory.propTypes = {
  datasetId: PropTypes.string,
}

export default DatasetHistory
