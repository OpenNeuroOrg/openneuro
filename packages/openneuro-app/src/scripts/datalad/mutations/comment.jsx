import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { convertToRaw } from 'draft-js'

const NEW_COMMENT = gql`
  mutation newComment($datasetId: ID!, $parentId: ID, $comment: String!) {
    newComment(datasetId: $datasetId, parentId: $parentId)
  }
`

const CommentMutation = ({ datasetId, parentId, comment, disabled }) => {
  return (
    <Mutation mutation={NEW_COMMENT}>
      {newComment => (
        <button
          className="btn-modal-action"
          disabled={disabled}
          onClick={() => {
            const serializedComment = JSON.stringify(convertToRaw(comment))
            console.log(datasetId, parentId, serializedComment)
            //newComment({ variables: { datasetId, parentId, comment } })
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
  comment: PropTypes.object,
  disabled: PropTypes.bool,
}

export default CommentMutation
