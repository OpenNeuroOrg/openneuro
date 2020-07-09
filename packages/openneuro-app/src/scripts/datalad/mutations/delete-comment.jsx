import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { DATASET_COMMENTS } from '../dataset/comments-fragments.js'
import { datasetCacheId } from './cache-id.js'

const deleteComment = gql`
  mutation deleteComment($commentId: ID!, $deleteChildren: Boolean) {
    deleteComment(commentId: $commentId, deleteChildren: $deleteChildren)
  }
`

/**
 * Delete one or more existing comments and return new state based on arguments
 * @param {Object[]} comments
 * @param {Object} arguments
 * @param {string[]} arguments.deletedCommentIds
 * @returns {Object[]}
 */
export const deleteCommentsReducer = (comments, { deletedCommentIds }) => {
  // Must copy with freezeResults enabled
  const nextCommentsState = [...comments].filter(
    c => !deletedCommentIds.includes(c.id),
  )
  return nextCommentsState
}

const DeleteComment = ({ datasetId, commentId }) => {
  return (
    <Mutation
      mutation={deleteComment}
      update={(cache, { data: { deleteComment } }) => {
        const { comments } = cache.readFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_COMMENTS,
        })
        // Apply state reduction to cache for new comment changes
        const nextCommentsState = deleteCommentsReducer(comments, {
          deletedCommentIds: deleteComment,
        })
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_COMMENTS,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            comments: nextCommentsState,
          },
        })
      }}>
      {deleteComment => (
        <a
          className="delete"
          onClick={async () => {
            await deleteComment({
              variables: {
                commentId,
                deleteChildren: true,
              },
            })
          }}>
          <i className="fa fa-trash" />
          Delete
        </a>
      )}
    </Mutation>
  )
}

DeleteComment.propTypes = {
  datasetId: PropTypes.string,
  commentId: PropTypes.string,
}

export default DeleteComment
