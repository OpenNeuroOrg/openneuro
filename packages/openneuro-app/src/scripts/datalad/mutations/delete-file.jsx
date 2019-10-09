import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetCacheId } from './cache-id.js'
import { DRAFT_FRAGMENT } from '../dataset/dataset-query-fragments.js'

const DELETE_FILE = gql`
  mutation deleteFile($datasetId: ID!, $path: String!, $filename: String!) {
    deleteFile(datasetId: $datasetId, path: $path, filename: $filename)
  }
`

/**
 * Remove file with given filename from draft
 * @param {string} filename - file to be deleted
 * @param {Object} draft - current draft in apollo cache
 * @returns {Object} - updated version of draft
 */
export const deleteFileReducer = (path, filename, draft) => {
  const filepath = [...path.split(':'), filename].join('/')
  return {
    ...draft,
    files: draft.files.filter(file => file.filename !== filepath),
  }
}

const DeleteFile = ({ datasetId, path, filename }) => (
  <Mutation
    mutation={DELETE_FILE}
    update={(cache, { data: { deleteFile } }) => {
      if (deleteFile) {
        const id = datasetCacheId(datasetId)
        const { draft } = cache.readFragment({
          id,
          fragment: DRAFT_FRAGMENT,
        })
        const updatedDraft = deleteFileReducer(path, filename, draft)
        cache.writeFragment({
          id,
          fragment: DRAFT_FRAGMENT,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            draft: updatedDraft,
          },
        })
      }
    }}>
    {deleteFile => (
      <span className="delete-file">
        <WarnButton
          message="Delete"
          icon="fa-trash"
          warn={true}
          className="edit-file"
          action={cb => {
            deleteFile({ variables: { datasetId, path, filename } }).then(
              () => {
                cb()
              },
            )
          }}
        />
      </span>
    )}
  </Mutation>
)

DeleteFile.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default DeleteFile
