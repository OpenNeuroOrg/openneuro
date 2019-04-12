import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetQueryRefetch } from '../dataset/dataset-query-refetch.js'

const DELETE_FILE = gql`
  mutation deleteFile($datasetId: ID!, $path: String!, $filename: String!) {
    deleteFile(datasetId: $datasetId, path: $path, filename: $filename)
  }
`

const DeleteFile = ({ datasetId, path, filename }) => (
  <Mutation
    mutation={DELETE_FILE}
    refetchQueries={datasetQueryRefetch(datasetId)}>
    {deleteFile => (
      <WarnButton
        message="Delete"
        icon="fa-trash"
        warn={true}
        action={cb => {
          deleteFile({ variables: { datasetId, path, filename } }).then(() => {
            cb()
          })
        }}
      />
    )}
  </Mutation>
)

DeleteFile.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default DeleteFile
