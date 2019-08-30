import gql from 'graphql-tag'

export const DATASET_COMMENT_FIELDS = gql`
  fragment DatasetCommentFields on Comment {
    id
    text
    createDate
    user {
      email
    }
    parent {
      id
    }
    replies {
      id
    }
  }
`

export const DATASET_COMMENTS = gql`
  fragment DatasetComments on Dataset {
    id
    comments {
      id
      text
      createDate
      user {
        email
      }
      parent {
        id
      }
      replies {
        id
      }
    }
  }
`
