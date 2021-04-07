import { gql } from '@apollo/client'

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
