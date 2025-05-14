import { gql } from "@apollo/client"

export const USER_FRAGMENT = gql`
  fragment userFields on User {
    id
    name
    admin
    blocked
    email
    provider
    lastSeen
    created
    avatar
    github
    institution
    location
    modified
    orcid
  
  }
`
