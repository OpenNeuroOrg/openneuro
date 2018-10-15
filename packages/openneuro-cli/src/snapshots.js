import gql from 'graphql-tag'

const getSnapshotsQuery = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      snapshots {
        id
        tag
        created
        description {
          Name
        }
      }
    }
  }
`

export const getSnapshots = client => datasetId =>
  client.query({
    query: getSnapshotsQuery,
    variables: { id: datasetId },
  })
