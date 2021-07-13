import { gql } from '@apollo/client'

export const USER_FRAGMENT = gql`
  fragment userFields on User {
    id
    name
    email
    provider
    admin
    created
    lastSeen
    blocked
  }
`
