import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { convertToRaw } from 'draft-js'

const NEW_COMMENT = gql`
  mutation addComment($datasetId: ID!, $parentId: ID, $comment: String!) {
    addComment(datasetId: $datasetId, parentId: $parentId, comment: $comment)
  }
`

const CommentMutation = ({ datasetId, parentId, comment, disabled }) => {
  return (
    <Mutation mutation={NEW_COMMENT}>
      {newComment => (
        <button
          className="btn-modal-action"
          disabled={disabled}
          onClick={() =>
            newComment({
              variables: {
                datasetId,
                parentId,
                comment: JSON.stringify(convertToRaw(comment)),
              },
            }).then(newCommentId => console.log(newCommentId))
          }>
          Submit Comment
        </button>
      )}
    </Mutation>
  )
}

CommentMutation.propTypes = {
  datasetId: PropTypes.string,
  parentId: PropTypes.string,
  comment: PropTypes.object,
  disabled: PropTypes.bool,
}

export default CommentMutation
