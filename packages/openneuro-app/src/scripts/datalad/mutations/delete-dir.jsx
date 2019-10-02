import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetCacheId } from './cache-id.js'
import { DRAFT_FRAGMENT } from '../dataset/dataset-query-fragments.js'

const DELETE_FILES = gql`
  mutation deleteFiles($datasetId: ID!, $path: String!, $filename: String!) {
    deleteFile(datasetId: $datasetId, path: $path, filename: $filename)
  }
`

/**
 * Remove file with given filename from draft
 * @param {string} filenames - array file to be deleted
 * @param {Object} draft - current draft in apollo cache
 * @returns {Object} - updated version of draft
 */
export const deleteFilesReducer = (path, filenames, draft) => {
  const filepath = [...path.split(':'), filenames].join('/')
  return {
    ...draft,
    files: draft.files.filter(file => file.filename !== filepath),
  }
}

const DeleteDir = ({ datasetId, path, filename }) => (
  <Mutation
    mutation={DELETE_FILES}
    update={(cache, { data: { deleteFile } }) => {
      if (deleteFile) {
        const id = datasetCacheId(datasetId)
        const { draft } = cache.readFragment({
          id,
          fragment: DRAFT_FRAGMENT,
        })
        const updatedDraft = deleteFilesReducer(path, filename, draft)
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
    {deleteFiles => (
      <span className="delete-file">
        <WarnButton
          message="Delete"
          icon="fa-trash"
          warn={true}
          className="edit-file"
          action={cb => {
            deleteFiles({ variables: { datasetId, path, filename } }).then(
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

DeleteDir.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default DeleteDir
