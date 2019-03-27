import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const NEW_COMMENT = gql`
  mutation newComment($datasetId: ID!, $parentId: ID, $comment: String!) {
    newComment(datasetId: $datasetId, parentId: $parentId)
  }
`

const CommentMutation = ({ datasetId, parentId, comment }) => {
  return (
    <Mutation mutation={NEW_COMMENT}>
      {newComment => (
        <button
          className="btn-modal-action"
          onClick={
            () => console.log(datasetId, parentId, comment)
            //newComment({ variables: { datasetId, parentId, comment } })
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
  comment: PropTypes.string,
}

export default CommentMutation
