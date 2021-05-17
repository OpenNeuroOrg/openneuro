import { gql } from '@apollo/client'

export const getUsers = gql`
  query getUsers {
    users {
      id
      _id: id
      name
      email
      provider
      admin
      created
      lastSeen
      blocked
    }
  }
`

export const removeUser = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id)
  }
`

export const setAdmin = gql`
  mutation setAdmin($id: ID!, $admin: Boolean!) {
    setAdmin(id: $id, admin: $admin) {
      id
    }
  }
`
