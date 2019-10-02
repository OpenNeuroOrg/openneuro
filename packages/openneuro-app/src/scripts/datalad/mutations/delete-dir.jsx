import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetCacheId } from './cache-id.js'
import { DRAFT_FRAGMENT } from '../dataset/dataset-query-fragments.js'

const DELETE_FILES = gql`
  mutation deleteFiles($datasetId: ID!, $files: FileTree!) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`

/**
 * @typedef FileTree
 * @type {Object}
 * @property {Object[]} files
 * @property {string} files.filename
 * @property {FileTree[]} directories
 * @property {string} path formatted as 'dirA:dirB:dirC'
 */

/**
 * Get all filepaths in file tree
 * @param {FileTree} fileTree
 * @returns {string[]} filepaths formatted as 'dirA/dirB/dirC/filename.ext'
 */
const getDeletedFilepaths = fileTree => {
  const { files, directories, path } = fileTree
  if (files.length || directories.length) {
    const filepaths = files.map(file =>
      [...path.split(':'), file.filename].join('/'),
    )
    return filepaths.concat(...directories.map(getDeletedFilepaths))
  } else {
    return []
  }
}

/**
 * Remove file with given filename from draft
 * @param {FileTree} fileTree - array file to be deleted
 * @param {Object} draft - current draft of dataset in apollo cache
 * @returns {Object} - updated version of draft
 */
export const deleteFilesReducer = (fileTree, draft) => {
  const deletedFilepaths = getDeletedFilepaths(fileTree)
  return {
    ...draft,
    files: draft.files.filter(
      file => !deletedFilepaths.includes(file.filename),
    ),
  }
}

const DeleteDir = ({ datasetId, fileTree }) => (
  <Mutation
    mutation={DELETE_FILES}
    update={(cache, { data: { deleteFiles } }) => {
      if (deleteFiles) {
        const id = datasetCacheId(datasetId)
        const { draft } = cache.readFragment({
          id,
          fragment: DRAFT_FRAGMENT,
        })
        const updatedDraft = deleteFilesReducer(fileTree, draft)
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
            deleteFiles({
              variables: {
                datasetId,
                files: fileTree,
              },
            }).then(() => {
              cb()
            })
          }}
        />
      </span>
    )}
  </Mutation>
)

DeleteDir.propTypes = {
  datasetId: PropTypes.string,
  fileTree: PropTypes.object,
}

export default DeleteDir
