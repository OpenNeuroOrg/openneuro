import React from "react"
import PropTypes from "prop-types"
import { gql } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import { DATASET_COMMENTS } from "../fragments/comments-fragments"
import { datasetCacheId } from "./cache-id.js"
import { Icon } from "@openneuro/components/icon"

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
    (c) => !deletedCommentIds.includes(c.id),
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
            __typename: "Dataset",
            id: datasetId,
            comments: nextCommentsState,
          },
        })
      }}
    >
      {(deleteComment) => (
        <div className="col col-fixed">
          <a
            className="edit"
            onClick={async () => {
              await deleteComment({
                variables: {
                  commentId,
                  deleteChildren: true,
                },
              })
            }}
          >
            <Icon icon="fa fa-trash" label="Delete" />
          </a>
        </div>
      )}
    </Mutation>
  )
}

DeleteComment.propTypes = {
  datasetId: PropTypes.string,
  commentId: PropTypes.string,
}

export default DeleteComment
