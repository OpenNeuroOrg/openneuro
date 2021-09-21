import { gql } from '@apollo/client'

export const DATASET_REVIEWERS = gql`
  fragment DatasetReviewers on Dataset {
    id
    reviewers {
      expiration
      id
    }
  }
`