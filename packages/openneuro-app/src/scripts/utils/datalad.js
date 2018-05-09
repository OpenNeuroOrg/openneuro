import getClient from 'openneuro-client'
import gql from 'graphql-tag'
import bids from './bids'

const client = getClient('/crn/graphql')
export default {
    async getDatasets(options) {
      const query = gql`
        query {
          datasets {
            id
            _id: id
            created
            label
            uploader {
              id
            }
            public
          }
        }
      `
      return new Promise((resolve, reject) => {
        client.query({
          query: query
        })
        .then(data => {
            console.log('apollo data:', data)
            if (options.public) {
              data = data.data.datasets.filter((dataset) => {
                return dataset.public
              })
            }
            resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject()
        })
      })
    },

    getDataset(datasetId, options, callback) {
      if (!options.snapshot) {
        this.queryDataset(datasetId, (data) => {
          callback(data)
        })
      } else {
        this.querySnapshot(options.datasetId, options.tag, (data) => {
          console.log('getDataset options:', options)
          callback(data)
        })
      }
    },
    queryDataset(datasetId, callback) {
      console.log('datasetId in graphql query:', bids.decodeId(datasetId))

      const query = gql`
        query ds ($datasetId: ID!) {
          dataset (id: $datasetId) {
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
      `
      client.query({
        query: query,
        variables: {
            datasetId: bids.decodeId(datasetId)
        }
      })
      .then(data => {
          console.log('apollo data:', data)
          return callback(data)
      })
      .catch(err => {
        console.log(err)
        return callback()
      })
    },
    querySnapshot(datasetId, tag, callback) {
      client.query({
        query: gql`
          query getSnapshot ($datasetId: ID!, $tag: String!) {
            snapshot(datasetId: $datasetId, tag: $tag) {
              id
              tag
              created
              authors {
                ORCID
                name
              }
              summary {
                size
                totalFiles
              }
              files {
                id
                filename
                size
              }
            }
          }
        `,
        variables: {
          datasetId: bids.decodeId(datasetId),
          tag: tag
        }
      })
      .then(data => {
        console.log('apollo data:', data)
        return callback(data)
      })
      .catch(err => {
        console.log('error in snapshot query:', err) 
        return callback(err)
      })
  }
}