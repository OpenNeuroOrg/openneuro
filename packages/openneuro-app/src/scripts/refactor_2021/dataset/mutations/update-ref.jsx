import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'

const RESET_DRAFT = gql`
  mutation resetDraft($datasetId: ID!, $ref: String!) {
    resetDraft(datasetId: $datasetId, ref: $ref)
  }
`

const UpdateRef = ({ datasetId, revision }) => (
  <Mutation mutation={RESET_DRAFT}>
    {resetDraft => (
      <span>
        <button
          className="btn-admin-blue"
          onClick={async () => {
            await resetDraft({
              variables: {
                datasetId,
                ref: revision,
              },
            })
          }}>
          <i className="fa fa-history" /> Reset Draft Head
        </button>
      </span>
    )}
  </Mutation>
)

UpdateRef.propTypes = {
  datasetId: PropTypes.string,
  revision: PropTypes.string,
}

export default UpdateRef
