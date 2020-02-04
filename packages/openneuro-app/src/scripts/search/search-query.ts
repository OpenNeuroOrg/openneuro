import gql from 'graphql-tag'

export default gql`
  query searchConnection($q: String!) {
    search {
      searchConnection {
        q
      }
    }
  }
`
