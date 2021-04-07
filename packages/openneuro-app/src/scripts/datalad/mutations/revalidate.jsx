import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'

const REVALIDATE = gql`
  mutation revalidate($datasetId: ID!, $ref: String!) {
    revalidate(datasetId: $datasetId, ref: $ref)
  }
`

const Revalidate = ({ datasetId, revision }) => (
  <Mutation mutation={REVALIDATE}>
    {revalidate => (
      <span>
        <button
          className="btn-admin-blue"
          onClick={async () => {
            await revalidate({
              variables: {
                datasetId,
                ref: revision,
              },
            })
          }}>
          <i className="fa fa-random" /> Revalidate Commit
        </button>
      </span>
    )}
  </Mutation>
)

Revalidate.propTypes = {
  datasetId: PropTypes.string,
  revision: PropTypes.string,
}

export default Revalidate
