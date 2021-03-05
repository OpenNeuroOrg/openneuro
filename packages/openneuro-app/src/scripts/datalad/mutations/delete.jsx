import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'

const DELETE_DATASET = gql`
  mutation deleteDataset($id: ID!, $reason: String, $redirect: String) {
    deleteDataset(id: $id, reason: $reason, redirect: $redirect)
  }
`

const DeleteDataset = ({ datasetId, metadata }) => {
  const [warn, setWarn] = React.useState(false)
  const handleClick = deleteDataset => () => {
    if (!warn) setWarn(true)
    else deleteDataset()
  }

  return (
    <Mutation mutation={DELETE_DATASET}>
      {deleteDataset => (
        <span>
          <button
            className="btn-admin-blue"
            style={{ color: warn ? 'red' : null }}
            onClick={handleClick(async () => {
              await deleteDataset({
                variables: {
                  id: datasetId,
                  reason: metadata.reason,
                  redirect: metadata.redirect,
                },
              })
              window.location.replace(
                `${window.location.origin}/dashboard/datasets`,
              )
            })}>
            <i className="fa fa-trash" />
            {warn ? ' Confirm Delete' : ' Delete Dataset'}
          </button>
        </span>
      )}
    </Mutation>
  )
}

DeleteDataset.propTypes = {
  datasetId: PropTypes.string,
  metadata: PropTypes.object,
}

export default DeleteDataset
