import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'

const CACHE_CLEAR = gql`
  mutation cacheClear($datasetId: ID!) {
    cacheClear(datasetId: $datasetId)
  }
`

const CacheClear = ({ datasetId }) => (
  <Mutation mutation={CACHE_CLEAR}>
    {cacheClear => (
      <span>
        <button
          className="btn-admin-blue"
          onClick={async () => {
            await cacheClear({
              variables: {
                datasetId,
              },
            })
          }}>
          <i className="fa fa-eraser" /> Delete Dataset Cache
        </button>
      </span>
    )}
  </Mutation>
)

CacheClear.propTypes = {
  datasetId: PropTypes.string,
}

export default CacheClear
