import config from '../../../config'
import getClient, { datasets, files, users, snapshots } from 'openneuro-client'
import gql from 'graphql-tag'
import bids from './bids'
import clone from 'lodash.clonedeep'
import request from './request'

const client = getClient(`${config.url}/crn/graphql`)
export default {
  async getDatasets(options) {
    return new Promise((resolve, reject) => {
      client
        .query({
          query: datasets.getDatasets,
          fetchPolicy: 'no-cache',
        })
        .then(data => {
          data = clone(data)
          let datasets = data.data.datasets
          if (options.isPublic) {
            datasets = data.data.datasets.filter(dataset => {
              return dataset.public
            })
          }
          data.data.datasets = datasets
          resolve(data)
        })
        .catch(err => {
          // console.log('error in getDatasets:', err)
          reject(err)
        })
    })
  },

  getDataset(datasetId) {
    return new Promise((resolve, reject) => {
      this.queryDataset(datasetId, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  },

  async getSnapshot(datasetId, options) {
    return new Promise((resolve, reject) => {
      this.querySnapshot(datasetId, options.tag, (err, data) => {
        if (err) return reject(err)
        data = clone(data)
        data.data.snapshot._id = options.datasetId
        resolve(data)
      })
    })
  },

  queryDataset(datasetId, callback) {
    const query = datasets.getDataset
    return client
      .query({
        query: query,
        variables: {
          id: bids.decodeId(datasetId),
        },
        fetchPolicy: 'no-cache',
      })
      .then(data => {
        data = clone(data)
        if (data.data.dataset) {
          let snapshots = data.data.dataset.snapshots
            ? data.data.dataset.snapshots.slice(0)
            : []
          for (let snapshot of snapshots) {
            let splitId = snapshot.id.split(':')
            snapshot._id = splitId[splitId.length - 1]
            snapshot.original = splitId[0]
          }
          data.data.dataset.files = data.data.dataset.draft
            ? data.data.dataset.draft.files
            : []
        }

        return callback(null, data)
      })
      .catch(err => {
        // console.log('error in datasetQuery:', err)
        return callback(err, null)
      })
  },

  async checkPartial(datasetId) {
    return client.query({
      query: datasets.checkPartial,
      variables: { datasetId: bids.decodeId(datasetId) },
    })
  },

  querySnapshot(datasetId, tag, callback) {
    client
      .query({
        query: snapshots.getSnapshot,
        variables: {
          datasetId: bids.decodeId(datasetId),
          tag: tag,
        },
      })
      .then(data => {
        return callback(null, data)
      })
      .catch(err => {
        // console.log('error in snapshot query:', err)
        return callback(err, null)
      })
  },

  getDatasetIssues(datasetId) {
    let query = datasets.getDatasetIssues
    return new Promise((resolve, reject) => {
      client
        .query({
          query: query,
          variables: {
            datasetId: datasetId,
          },
        })
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  deleteDataset(datasetId, options) {
    if (options.snapshot && options.tag) {
      let mutation = datasets.deleteSnapshot
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation: mutation,
            variables: {
              datasetId: bids.decodeId(datasetId),
              tag: options.tag,
            },
          })
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    } else {
      let mutation = datasets.deleteDataset
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation: mutation,
            variables: {
              id: bids.decodeId(datasetId),
            },
          })
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },

  updatePublic(datasetId, publicFlag) {
    datasetId = bids.decodeId(datasetId)
    const mutation = datasets.updatePublic
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: mutation,
          variables: {
            id: bids.decodeId(datasetId),
            publicFlag: publicFlag,
          },
        })
        .then(data => {
          let uri = `/crn/datasets/${datasetId}/publish`
          // if now public, initialize migration to a public s3 bucket
          // otherwise, initialize migration to a private s3 bucket
          if (publicFlag) {
            request
              .post(uri)
              .then(() => resolve(data))
              .catch(err => reject(err))
          } else {
            request
              .del(uri)
              .then(() => resolve(data))
              .catch(err => reject(err))
          }
        })
        .catch(err => {
          // console.log('error in updatePublic:', err)
          reject(err)
        })
    })
  },

  createSnapshot(datasetId, tag) {
    const mutation = gql`
      mutation($datasetId: ID!, $tag: String!) {
        createSnapshot(datasetId: $datasetId, tag: $tag) {
          id
          tag
        }
      }
    `
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: mutation,
          variables: {
            datasetId: bids.decodeId(datasetId),
            tag: tag,
          },
        })
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          // console.log('error in createSnapshot:', err)
          reject(err)
        })
    })
  },

  // FILE OPERATIONS

  getFile(datasetId, filename, options) {
    filename = this.encodeFilePath(filename)
    let uri = `/crn/datasets/${datasetId}/files/${filename}`
    if (options && options.snapshot) {
      uri = `/crn/datasets/${datasetId}/snapshots/${
        options.tag
      }/files/${filename}`
    }
    return new Promise((resolve, reject) => {
      request
        .get(uri, {
          headers: {
            'Content-Type': 'application/*',
          },
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          // console.log('error in getFile:', err)
          reject(err)
        })
    })
  },

  deleteFiles(datasetId, fileTree) {
    let mutation = files.deleteFiles

    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: mutation,
          variables: {
            datasetId: bids.decodeId(datasetId),
            files: fileTree,
          },
        })
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          // console.log('error in deleteFiles:', err)
          reject(err)
        })
    })
  },

  deleteFile(datasetId, file) {
    // get the file path from the file object
    let filePath = file.modifiedName
      ? this.encodeFilePath(file.modifiedName)
      : this.encodeFilePath(file.name)

    // shape the file into the same shape as accepted by deleteFiles
    let fileTree = this.constructFileTree(file, filePath)

    // call updateFiles
    return this.deleteFiles(datasetId, fileTree)
  },

  deleteDirectory(datasetId, pathname) {
    let path = this.encodeFilePath(pathname)
    let fileTree = {
      name: path,
      files: [],
      directories: [],
    }
    return this.deleteFiles(datasetId, fileTree)
  },

  addDirectory(datasetId, uploads) {
    uploads = uploads.map(u => {
      let file = u.file
      let container = u.container
      file.modifiedName = (container.dirPath || '') + file.name
      // get the file path from the file object
      file.filePath = file.modifiedName
        ? this.encodeFilePath(file.modifiedName)
        : this.encodeFilePath(file.name)
      file.container = container
      return file
    })
    let fileTree = this.constructDirectoryTree(uploads)
    return new Promise((resolve, reject) => {
      this.updateFiles(datasetId, fileTree)
        .then(() => resolve())
        .catch(err => reject(err))
    })
  },

  constructDirectoryTree(dirFiles) {
    let name = this.encodeFilePath(dirFiles[0].container.dirPath.slice(0, -1))
    let trimmed = dirFiles.map(f => {
      let pathComponents = f.filePath.split(':')
      let trimmedPathComponents = pathComponents.slice(1)
      let trimmedPath = trimmedPathComponents.join(':')
      f.filePath = trimmedPath
      f.thisLevel = trimmedPathComponents.length == 1
      return f
    })
    let filesOnThisLevel = trimmed.filter(f => {
      return f.thisLevel
    })
    let filesInOtherDirectory = trimmed.filter(f => {
      return !f.thisLevel
    })
    let otherDirectories = filesInOtherDirectory
      .map(f => {
        return f.filePath.split(':')[0]
      })
      .filter((v, i, s) => {
        return s.indexOf(v) === i
      })

    let directories = []
    for (let directory of otherDirectories) {
      let associatedFiles = filesInOtherDirectory.filter(f => {
        return f.filePath.split(':')[0] == directory
      })
      directories.push(this.constructDirectoryTree(associatedFiles))
    }
    let fileTree = {
      name: name,
      files: filesOnThisLevel,
      directories: directories,
    }
    return fileTree
  },

  updateFiles(datasetId, fileTree) {
    let mutation = files.updateFiles

    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: mutation,
          variables: {
            datasetId: bids.decodeId(datasetId),
            files: fileTree,
          },
        })
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          // console.log('error in updateFiles:', err)
          reject(err)
        })
    })
  },

  updateFile(datasetId, file) {
    // get the file path from the file object
    let filePath = file.modifiedName
      ? this.encodeFilePath(file.modifiedName)
      : this.encodeFilePath(file.name)

    // shape the file into the same shape as accepted by updateFiles
    let fileTree = this.constructFileTree(file, filePath)

    // call updateFiles
    return this.updateFiles(datasetId, fileTree)
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
      let newPath = pathComponents
        .reverse()
        .slice(1)
        .reverse()
        .join(':')
      let files = newNode === fileName ? [file] : []
      let directories =
        newNode === fileName ? [] : this.constructFileTree(file, newPath)
      let fileTree = {
        name: newPath,
        files: files,
        directories: directories,
      }
      return fileTree
    }
  },

  encodeFilePath(path) {
    return path.replace(new RegExp('/', 'g'), ':')
  },

  decodeFilePath(path) {
    return path.replace(new RegExp(':', 'g'), '/')
  },

  // PERMISSIONS OPERATIONS

  /**
   * Update Permissions
   *
   * adds / updates a user's role on a dataset
   * @param {*} datasetId id of dataset that requires permissions update
   * @param {*} userEmail permissions will be changed for all users with this email
   * @param {*} level the access level we wish to grant the user, 'r' = read, 'rw' = read / write, 'admin' = all access
   */
  updatePermissions(datasetId, userEmail, level) {
    datasetId = bids.decodeId(datasetId)
    return client.mutate({
      mutation: datasets.updatePermissions,
      variables: {
        datasetId,
        userEmail,
        level,
      },
    })
  },

  /**
   * Remove Permissions
   *
   * removes a user's role on a dataset
   * @param {*} datasetId id of dataset that requires permission removal
   * @param {*} userId permissions will be removed for the user with this id
   */
  removePermissions(datasetId, userId) {
    let mutation = datasets.removePermissions
    datasetId = bids.decodeId(datasetId)
    return client.mutate({
      mutation: mutation,
      variables: {
        datasetId,
        userId,
      },
    })
  },

  // Users
  /**
   * Get Users
   *
   * gets a list of all users
   *
   */
  getUsers() {
    const query = users.getUsers
    return new Promise((resolve, reject) => {
      client
        .query({
          query: query,
        })
        .then(data => {
          let users = data.data ? data.data.users : []
          resolve(clone(users))
        })
        .catch(err => reject(err))
    })
  },

  /**
   * Remove User
   */
  removeUser(id) {
    return client.mutate({
      mutation: users.removeUser,
      variables: {
        id: id,
      },
    })
  },

  /**
   * Toggle Admin
   *
   * Takes a user id and updates the user's admin prop
   */
  setAdmin(id, admin) {
    return client.mutate({
      mutation: users.setAdmin,
      variables: {
        id: id,
        admin: admin,
      },
    })
  },

  //Analytics
  /**
   * Track Analytics
   *
   * Adds a 'view' or 'download' type entry to the analytics for a specific dataset
   */
  trackAnalytics(datasetId, options) {
    options = options || {}
    return client.mutate({
      mutation: datasets.trackAnalytics,
      variables: {
        datasetId: datasetId,
        tag: options.tag,
        type: options.type,
      },
    })
  },
}
