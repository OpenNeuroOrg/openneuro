import getClient from 'openneuro-client'
import gql from 'graphql-tag'
import bids from './bids'
import config from '../../../config'
import clone from 'lodash.clonedeep'

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
            data = clone(data)
            let datasets = data.data.datasets
            if (options.isPublic) {
              datasets = data.data.datasets.filter((dataset) => {
                return dataset.public
              })
            }
            data.data.datasets = datasets
            resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
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
            _id: id
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
              _id: id
              tag
              snapshot_version: tag
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
          data = clone(data)
          let snapshots = data.data.dataset.snapshots.slice(0)
          for (let snapshot of snapshots) {
              let splitId = snapshot.id.split(':')
              snapshot._id = splitId[splitId.length -1]
              snapshot.original = splitId[0]
          }
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
              _id: id
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
                _id: id
                name: filename
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
    },

    updatePublic(datasetId, publicFlag) {
      console.log('calling updatePublic mutation with datasetId:', datasetId, 'and publicFlag:', publicFlag)
      const mutation = gql`
        mutation ($datasetId: ID!, $publicFlag: Boolean!) {
          updatePublic(datasetId: $datasetId, publicFlag: $publicFlag)
        }
      `
      return new Promise((resolve, reject) => {
        client.mutate({
          mutation: mutation,
          variables: {
            datasetId: bids.decodeId(datasetId),
            publicFlag: publicFlag
          }
        })
        .then(data => {
          console.log('response from updateSnapshotPublic:', data)
          resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      })
      
    }
}