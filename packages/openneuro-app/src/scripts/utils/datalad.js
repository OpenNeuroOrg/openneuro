import getClient from 'openneuro-client'
import {datasets, files} from 'openneuro-client'
import gql from 'graphql-tag'
import bids from './bids'
import clone from 'lodash.clonedeep'
import request from './request'
import config from '../../../config'

const URI = config.datalad.uri

const client = getClient('/crn/graphql')
export default {
    async getDatasets(options) {
      const query = datasets.getDatasets
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

      const query = datasets.getDataset
      client.query({
        query: query,
        variables: {
            id: bids.decodeId(datasetId)
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
          data.data.dataset.files = data.data.dataset.draft ? data.data.dataset.draft.files : []
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
      console.log('calling updatePublic mutation with id:', datasetId, 'and publicFlag:', publicFlag)
      const mutation = datasets.updatePublic
      return new Promise((resolve, reject) => {
        client.mutate({
          mutation: mutation,
          variables: {
            id: bids.decodeId(datasetId),
            publicFlag: publicFlag
          }
        })
        .then(data => {
          console.log('response from updatePublic:', data)
          resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      })
      
    },

    createSnapshot(datasetId, tag) {
      console.log('calling createSnapshot mutation with datasetId:', datasetId, 'and publicFlag:', tag)
      const mutation = gql`
        mutation ($datasetId: ID!, $tag: String!) {
          createSnapshot(datasetId: $datasetId, tag: $tag) {
            id
            tag
          }
        }
      `
      return new Promise((resolve, reject) => {
        client.mutate({
          mutation: mutation,
          variables: {
            datasetId: bids.decodeId(datasetId),
            tag: tag
          }
        })
        .then(data => {
          console.log('response from createSnapshot:', data)
          resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      })

    },
    
    getFile(datasetId, filename, options) {
      filename = this.encodeFilePath(filename)
      const uri = `/crn/datasets/${datasetId}/files/${filename}`
      return new Promise((resolve, reject) => {
        request
          .get(uri, {
            headers: {
              'Content-Type': 'application/*'
            }
          })
          .then((res) => {
            console.log('res from getFile:', res)
            let file = res.body
            resolve(res)
          })
          .catch((err) => {
            console.log('error in getFile:', err)
            reject(err)
          })
    })
    },

    updateFiles(datasetId, fileTree, options) {
      let mutation = files.updateFiles

      return new Promise((resolve, reject) => {
        client.mutate({
          mutation: mutation,
          variables: {
            datasetId: bids.decodeId(datasetId),
            files: fileTree
          }
        })
        .then(data => {
          console.log('response from updateFiles:', data)
          resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },

    updateFile(datasetId, file, options) {
      // get the file path from the file object
      let filePath = file.modifiedName ? this.encodeFilePath(file.modifiedName) : this.encodeFilePath(file.name)

      // shape the file into the same shape as accepted by updateFiles
      let fileTree = this.constructFileTree(file, filePath)

      // call updateFiles
      return this.updateFiles(datasetId, fileTree, {})
    },

    updateFileFromString(datasetId, filename, value, type) {
      let file = new File([value], filename, { type: type })
      return this.updateFile(datasetId, file)
    },

    constructFileTree(file, filePath) {
      let fileName = filePath.split(':').slice(-1)[0]
      if (filePath.split(':').length > 0) {
        let pathComponents = filePath.split(':')
        let newNode = pathComponents.slice(-1)[0]
        let newPath = pathComponents.reverse().slice(1).reverse().join(':')
        let files = (newNode === fileName) ? [file] : []
        let directories = (newNode === fileName) ? [] : this.constructFileTree(file, newPath)
        let fileTree = {
          name: newPath,
          files: files,
          directories: directories
        }
        return fileTree
      }
  },

  encodeFilePath(path) {
    return path.replace(new RegExp('/', 'g'), ':')
  },
  
  decodeFilePath(path) {
    return path.replace(new RegExp(':', 'g'), '/')
  }

}