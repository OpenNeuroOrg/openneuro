import gql from 'graphql-tag'

export const getUsers = gql`
  query {
    users {
      id
      _id: id
      name
      email
      provider
      admin
      created
      lastSeen
    }
  }
`

export const removeUser = gql`
  mutation($id: ID!) {
    removeUser(id: $id)
  }
`

export const setAdmin = gql`
  mutation($id: ID!, $admin: Boolean!) {
    setAdmin(id: $id, admin: $admin)
  }
`
