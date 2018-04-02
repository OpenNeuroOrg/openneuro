/**
 * openfmri.org backwards compatibility API
 *
 * A set of express handlers that replicate the Python API using
 * OpenNeuro's GraphQL endpoint
 */
import gql from 'graphql-tag'
import client from '../libs/graphql.client.js'

export const getDataset = (req, res) => {
  const datasetId = req.params.datasetId
  return client
    .query({
      query: gql`
        query {
          dataset(id: "${datasetId}") {
            id
          }
        }
      `,
    })
    .then(data => {
      res.status(200)
      res.json(data)
    })
}
