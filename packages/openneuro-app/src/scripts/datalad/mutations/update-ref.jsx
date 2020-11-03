import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const UPDATE_REF = gql`
  mutation updateRef($datasetId: ID!, $ref: String!) {
    updateRef(datasetId: $datasetId, ref: $ref)
  }
`

const UpdateRef = ({ datasetId, revision }) => (
  <Mutation mutation={UPDATE_REF}>
    {updateRef => (
      <span>
        <button
          className="btn-admin-blue"
          onClick={async () => {
            await updateRef({
              variables: {
                datasetId,
                ref: revision,
              },
            })
          }}>
          <i className="fa fa-random" /> Reset Draft Head
        </button>
      </span>
    )}
  </Mutation>
)

UpdateRef.propTypes = {
  datasetId: PropTypes.string,
  ref: PropTypes.string,
}

export default UpdateRef
