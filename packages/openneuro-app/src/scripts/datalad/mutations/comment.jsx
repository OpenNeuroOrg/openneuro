import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { convertToRaw } from 'draft-js'
import withProfile from '../../authentication/withProfile.js'
import { DATASET_COMMENTS } from '../dataset/comments-fragments.js'
import { datasetCacheId } from './cache-id.js'

const NEW_COMMENT = gql`
  mutation addComment($datasetId: ID!, $parentId: ID, $comment: String!) {
    addComment(datasetId: $datasetId, parentId: $parentId, comment: $comment)
  }
`

const EDIT_COMMENT = gql`
  mutation editComment($commentId: ID!, $comment: String!) {
    editComment(commentId: $commentId, comment: $comment)
  }
`

const CommentMutation = ({
  datasetId,
  parentId,
  commentId,
  comment,
  disabled,
  profile,
  done = () => {},
}) => {
  return (
    <Mutation
      mutation={commentId ? EDIT_COMMENT : NEW_COMMENT}
      update={(cache, { data: { addComment } }) => {
        const { comments } = cache.readFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_COMMENTS,
        })
        // Must copy with freezeResults enabled
        const commentsCopy = [...comments]
        // If new comment, add to parent replies array
        if (parentId) {
          const parentIndex = comments.findIndex(
            comment => comment.id === parentId,
          )
          const parentReplies = comments[parentIndex].replies
          commentsCopy[parentIndex] = {
            ...comments[parentIndex],
            replies: [
              ...parentReplies,
              { __typename: 'Comment', id: addComment },
            ],
          }
        }
        // Create a mock comment
        const newComment = {
          id: addComment || commentId,
          parent: { __typename: 'Comment', id: parentId },
          text: JSON.stringify(convertToRaw(comment)),
          createDate: new Date().toISOString(),
          user: { __typename: 'User', ...profile },
          replies: [],
          __typename: 'Comment',
        }
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_COMMENTS,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            comments: [...commentsCopy, newComment],
          },
        })
      }}>
      {newComment => (
        <button
          className="btn-modal-action"
          disabled={disabled}
          onClick={async () => {
            await newComment({
              variables: {
                datasetId,
                parentId,
                commentId,
                comment: JSON.stringify(convertToRaw(comment)),
              },
            })
            done()
          }}>
          Submit Comment
        </button>
      )}
    </Mutation>
  )
}

CommentMutation.propTypes = {
  datasetId: PropTypes.string,
  parentId: PropTypes.string,
  commentId: PropTypes.string,
  comment: PropTypes.object,
  disabled: PropTypes.bool,
  profile: PropTypes.object,
  done: PropTypes.func,
}

export default withProfile(CommentMutation)
