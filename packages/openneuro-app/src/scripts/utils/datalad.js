import getClient from 'openneuro-client'
import gql from 'graphql-tag'

const client = getClient('/crn/graphql')
export default {
    getDataset(datasetId, options, callback) {
        client.query({
            query: gql`
            {
              dataset(id: "ds001098") {
                id
                label
                created
                public
                uploader {
                  id
                  firstName
                  lastName
                  email
                }
                draft {
                  modified
                  files {
                    id
                    filename
                    size
                  }
                  summary {
                    modalities
                    sessions
                    subjects
                    tasks
                    size
                    totalFiles
                  }
                }
                snapshots {
                  id
                  tag
                }
              }
            }
          `,
          variables: {
              datasetId: datasetId
          }
        })
        .then(data => {
            console.log('apollo data:', data)
            return callback(data)
        })
    }
}