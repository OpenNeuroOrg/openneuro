import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import gql from 'graphql-tag'

const GET_HISTORY = gql`
  query DatasetHistory($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      history
    }
  }
`

const DatasetHistory = ({ datasetId }) => (
  <div className="dataset-history">
    <div className="col-xs-12"></div>
  </div>
)

DatasetHistory.propTypes = {
  datasetId: PropTypes.string,
}

export default DatasetHistory
