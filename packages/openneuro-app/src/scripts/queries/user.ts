import { gql } from "@apollo/client"

// GraphQL query to fetch user data
// GraphQL query to fetch user by ORCID
export const GET_USER = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      id
      name
      orcid
      email
      avatar
      location
      institution
      links
    }
  }
`

export const UPDATE_USER = gql`
mutation updateUser($id: ID!, $location: String, $links: [String], $institution: String) {
  updateUser(id: $id, location: $location, links: $links, institution: $institution) {
    id
    location
    links
    institution
  }
}
`
