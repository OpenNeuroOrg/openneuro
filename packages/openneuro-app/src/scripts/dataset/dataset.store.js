// dependencies ----------------------------------------------------------------------

import Reflux from 'reflux'
import React from 'react'
import async from 'async'
import Actions from './dataset.actions.js'
import scitran from '../utils/scitran'
import datalad from '../utils/datalad'
import crn from '../utils/crn'
import bids from '../utils/bids'
import userStore from '../user/user.store'
import userActions from '../user/user.actions'
import upload from '../utils/upload'
import config from '../../../config'
import files from '../utils/files'
import moment from 'moment'
import { stringify as querystring } from 'urlite/querystring'

let datasetStore = Reflux.createStore({
  // store setup -----------------------------------------------------------------------

  listenables: Actions,

  init: function() {
    this.setInitialState()
    this.loadApps()
    this.update({ currentUser: userStore.data })
  },

  getInitialState: function() {
    return this.data
  },

  // data ------------------------------------------------------------------------------

  data: {},

  update: function(data, callback) {
    for (let prop in data) {
      this.data[prop] = data[prop]
    }
    this.trigger(this.data, callback)
  },

  /**
   * Set Initial State
   *
   * Sets the state to the data object defined
   * inside the function. Also takes a diffs object
   * which will set the state to the initial state
   * with any differences passed.
   */
  setInitialState: function(diffs) {
    let data = {
      apps: {},
      activeJob: {
        label: false,
        version: false,
        job: false,
      },
      comments: [],
      commentTree: [],
      commentSortOrder: 'ASC',
      currentUpdate: null,
      currentUploadId: null,
      dataset: null,
      datasetTree: null,
      displayFile: {
        name: '',
        text: '',
        link: '',
        info: null,
      },
      editFile: {
        name: '',
        text: '',
        link: '',
        info: null,
      },
      loading: false,
      loadingApps: false,
      loadingJobs: false,
      loadingTree: false,
      loadedUrl: null,
      jobs: [],
      metadataIssues: {},
      modals: {
        displayFile: false,
        editFile: false,
        jobs: false,
        publish: false,
        share: false,
        update: false,
        subscribe: false,
        snapshot: false,
      },
      redirectUrl: null,
      snapshot: false,
      snapshots: [],
      selectedSnapshot: '',
      status: null,
      users: [],
      uploading: false,
      uploadingCanceled: false,
      uploadingScitranRequests: [],
      showSidebar:
        window.localStorage && window.localStorage.hasOwnProperty('showSidebar')
          ? window.localStorage.showSidebar === 'true'
          : true,
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // Actions ---------------------------------------------------------------------------

  // Dataset -----------------------------------------------------------------------

  /**
   * Load Dataset
   *
   * Takes a datasetId and loads the dataset.
   */
  loadDataset(datasetId, options, forceReload) {
    let snapshot = !!(options && options.snapshot)
    options = options ? options : {}
    options.isPublic = !userStore.data.token

    // set active job if passed in query param
    if (options) {
      this.update({
        activeJob: {
          app: options.app,
          version: options.version,
          job: options.job,
        },
      })
    }

    // update selection & current upload data, as well as loading state
    let loadedUrl = !options.snapshot
      ? datasetId
      : [datasetId, options.tag].join(':')
    this.update({
      selectedSnapshot: datasetId,
      currentUploadId: null,
      loading: true,
      loadingJobs: true,
      datasetTree: null,
      loadedUrl: loadedUrl,
    })
    bids.getDataset(
      datasetId,
      res => {
        if (res.status === 404 || res.status === 403) {
          this.update({
            status: res.status,
            dataset: null,
            loading: false,
            snapshot: snapshot,
          })
          const fallbackDatasetId = snapshot ? options.datasetId : datasetId
          this.generateFallbackUrl(fallbackDatasetId)
        } else {
          // don't update data if the user has selected another version during loading
          let selectedSnapshot = this.data.selectedSnapshot
          if (!selectedSnapshot || selectedSnapshot === datasetId) {
            let dataset = res
            this.update({
              dataset: dataset,
              datasetTree: [
                {
                  _id: datasetId,
                  label: dataset.label,
                  children: dataset.children,
                },
              ],
              loading: false,
            })
            this.loadJobs(
              bids.decodeId(datasetId),
              selectedSnapshot,
              bids.decodeId(datasetId),
              options,
              (err, jobs) => {
                this.loadSnapshots(dataset, jobs, () => {
                  this.loadComments(datasetId)
                  this.getDatasetStars()
                  this.checkSubscriptionFollowers(() => {
                    let datasetUrl = this.constructDatasetUrl(dataset)
                    this.update({
                      loading: false,
                      snapshot: snapshot,
                      datasetUrl: datasetUrl,
                    })
                  })
                })
              },
            )

            if (
              forceReload ||
              (!this.data.uploading && dataset.tags.includes('updating'))
            ) {
              this.revalidate()
              if (dataset.tags.includes('updating')) {
                scitran.removeTag('projects', datasetId, 'updating')
              }
            }
          }
        }
      },
      options,
    )
  },

  /**
   * Generate Fallback Url
   *
   * Given a datasetId, return the most recent
   * publicly available snapshot url
   */
  async generateFallbackUrl(datasetId) {
    try {
      const snapshotRes = await scitran.getProjectSnapshots(datasetId)
      const snapshots = snapshotRes ? snapshotRes.body : null

      if (snapshots && snapshots.length) {
        // sort snapshots
        snapshots.sort((a, b) => {
          if (a.snapshot_version < b.snapshot_version) {
            return 1
          } else if (a.snapshot_version > b.snapshot_version) {
            return -1
          } else {
            return 0
          }
        })

        const project = snapshots[0]
        if (project.snapshot_version) {
          const redirectUrl = String.prototype.concat(
            '/datasets/',
            bids.decodeId(datasetId),
            '/versions/',
            bids.decodeId(project._id),
          )
          this.update({
            redirectUrl: redirectUrl,
          })
        }
      }
    } catch (err) {
      this.update({
        redirectUrl: null,
      })
    }
  },

  /**
   * Load Dataset Tree
   */
  loadDatasetTree() {
    this.update({ loadingTree: true })
    bids.getDatasetTree(
      this.data.dataset,
      tree => {
        this.update({ loadingTree: false, datasetTree: tree })
      },
      { snapshot: this.data.snapshot },
    )
  },

  /**
   * Reload Dataset
   *
   * Optionally takes a datasetId and only reloads
   * the dataset if that ID matches the current ID.
   * If no ID is passed it reloads the current ID.
   */
  reloadDataset(datasetId) {
    if (this.data.dataset) {
      if (!datasetId) {
        this.loadDataset(this.data.dataset._id, {
          snapshot: this.data.snapshot,
        })
      } else if (this.data.dataset._id == datasetId) {
        this.loadDataset(datasetId)
      }
    }
  },

  /**
   * Load Users
   *
   * Loads a list of all users.
   */
  loadUsers() {
    scitran.getUsers().then(res => {
      this.update({ users: res.body })
    })
  },

  /**
   * Load Apps
   */
  loadApps() {
    this.update({ loadingApps: true })
    crn.getApps().then(res => {
      this.update({ apps: res.body, loadingApps: false })
    })
  },

  getJobLogs(id, callback) {
    crn.getJobLogs(id).then(res => {
      let modals = this.data.modals
      let logs = res.body
      modals.displayFile = true
      if (callback) {
        callback()
      }
      // For now, append each set of logs in order with some spacing
      let logsText = Object.keys(logs)
        .map(taskLogs => {
          return logs[taskLogs].reduce((taskLogs, logObj) => {
            return taskLogs + logObj.message + '\n  '
          }, '\n ==== ' + taskLogs + ' ====:\n') // Identify which task
        })
        .join('\n')
      this.update({
        displayFile: {
          name: 'Logs',
          text: logsText,
        },
        modals,
      })
    })
  },

  downloadLogs(id, callback) {
    callback(config.crn.url + 'jobs/' + id + '/logs')
  },

  getLogstream(logstreamName, history, callback) {
    // Default text in case logs are missing
    let logsText = 'No logs available.'
    crn
      .getLogstream(logstreamName)
      .then(res => {
        const logs = res.body
        if (callback) {
          callback()
        }
        // Append all rows together for in-browser display
        // Replaces the default text with the real logs
        logsText = logs
          .map(line => {
            return line.message
          })
          .join('\n')
      })
      .catch(err => {
        if (callback) {
          callback(err)
        }
        logsText = JSON.stringify(err)
      })
      .finally(() => {
        this.update({
          displayFile: {
            name: 'Logs',
            text: logsText,
            link: config.crn.url + 'logs/' + logstreamName + '/raw',
          },
        })
      })
  },

  /**
   * Publish
   *
   * Takes a snapshotId, value and callback and sets the
   * datasets public status to the passed value.
   */
  publish(snapshotId, value, history, callback) {
    let datasetId = this.data.snapshot
      ? this.data.dataset.original
      : this.data.dataset._id

    datalad.updatePublic(datasetId, value).then(() => {
      if (callback) {
        callback()
      }
      let dataset = this.data.dataset
      dataset.status.public = value
      this.data.public = value
      if (!dataset.description.DatasetDOI) {
        this.registerDoi.bind(this)()
      }
      let snapshots = this.data.snapshots

      history.push('/datasets/' + this.data.dataset.linkID)
      this.update({ dataset, snapshots })
    })
  },

  getDatasetDownloadTicket(callback) {
    scitran
      .getBIDSDownloadTicket(this.data.dataset._id, {
        snapshot: !!this.data.snapshot,
      })
      .then(res => {
        let ticket = res.body.ticket
        let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket
        callback(downloadUrl)
      })
  },

  /**
   * Confirm Dataset Download
   *
   * Tracks the dataset download and encourages
   * the user to subscribe to the dataset.
   */
  confirmDatasetDownload(history, callback) {
    this.trackDownload(() => {
      this.showDatasetComponent('subscribe', history, () => {
        callback()
      })
    })
  },

  /**
   * Track Download
   *
   * Tracks download and increments download
   * count (client side only) to provide immediate
   * download feedback.
   */
  trackDownload(callback) {
    scitran
      .trackUsage(this.data.dataset._id, 'download', { snapshot: true })
      .then(() => {
        let dataset = this.data.dataset
        dataset.downloads++
        this.update({ dataset })
        callback()
      })
  },

  /**
   * Delete Dataset
   *
   * Takes a datsetId, deletes the dataset, and returns the user
   * to the my datasets page.
   */
  deleteDataset(datasetId, history, callback) {
    if (this.data.snapshot) {
      let message = 'You are about to delete this snapshot.'
      this.updateWarn({
        alwaysWarn: true,
        confirmTxt: 'Delete',
        hideDontShow: true,
        message: message,
        action: () => {
          this.update({ loading: 'deleting' })
          datalad
            .deleteDataset(bids.decodeId(datasetId), {
              snapshot: this.data.snapshot,
              tag: this.data.dataset.snapshot_version,
            })
            .then(() => {
              this.update({ loading: false })
            })
        },
      })
    } else {
      let message =
        'You are about to delete this dataset. This will delete your draft and any unpublished snapshots. Any published snapshots for this dataset will remain publicly accessible. To remove public snapshots please contact the site administrator.'
      this.updateWarn({
        alwaysWarn: true,
        confirmTxt: 'Delete',
        hideDontShow: true,
        message: message,
        action: () => {
          this.update({ loading: 'deleting' })
          datalad
            .deleteDataset(bids.decodeId(datasetId), {
              snapshot: this.data.snapshot,
            })
            .then(() => {
              history.push('/dashboard/datasets')
            })
        },
      })
    }
    if (callback) {
      callback()
    }
  },

  /**
   * Toggle Modal
   */
  toggleModal(name, callback) {
    let update = {}

    // reload app is missing for job modals
    if (name === 'jobs' && (!this.data.apps || this.data.apps.length === 0)) {
      this.loadApps()
    }

    if (name === 'displayFile') {
      update.displayFile = {
        name: '',
        text: '',
        link: '',
      }
    }

    // update modals state
    let modals = this.data.modals
    modals[name] = !modals[name]
    update.modals = modals

    this.update({ update })

    // callback
    if (callback && typeof callback === 'function') {
      callback()
    }
  },

  /**
   * Dismiss All Modals
   */
  dismissModals(callback) {
    let update = {}
    update.displayFile = {
      name: '',
      text: '',
      link: '',
    }
    update.editFile = update.displayFile
    let modals = this.data.modals
    for (let modal of Object.keys(modals)) {
      modals[modal] = false
    }
    update.modals = modals
    this.update(update)
    if (callback && typeof callback === 'function') {
      callback()
    }
  },

  showDatasetComponent(name, history, callback) {
    let datasetUrl = this.data.datasetUrl
    if (datasetUrl) {
      let redirectUrl = datasetUrl
      if (name !== '') {
        redirectUrl = datasetUrl + '/' + name
        if (name === 'file-display') {
          let fileName = this.data.displayFile
            ? this.data.displayFile.name
            : null
          if (fileName) {
            redirectUrl = redirectUrl + '/' + datalad.encodeFilePath(fileName)
          }
        }
        if (name === 'file-edit') {
          let fileName = this.data.editFile ? this.data.editFile.name : null
          if (fileName) {
            redirectUrl = redirectUrl + '/' + datalad.encodeFilePath(fileName)
          }
        }
      }

      history.push(redirectUrl)
      if (callback) {
        callback()
      }
    }
  },

  /**
   * Update Status
   */
  updateStatus(projectId, updates) {
    if (this.data.dataset && this.data.dataset._id === projectId) {
      let dataset = this.data.dataset
      for (let prop in updates) {
        if (dataset.status.hasOwnProperty(prop)) {
          dataset.status[prop] = updates[prop]
        }
      }
      this.update({ dataset })
    }
  },

  // Metadata ----------------------------------------------------------------------

  /**
   * Update Modified
   *
   * Updated the last modified date for the current
   * dataset (client-side only).
   */
  updateModified() {
    let dataset = this.data.dataset
    dataset.modified = moment().format()
    this.update({ dataset })
  },

  updateName(value, callback) {
    // update description
    this.updateDescription('Name', value, callback)

    // update filetree
    let dataset = this.data.dataset
    let datasetTree = this.data.datasetTree
    dataset.label = value
    if (datasetTree && datasetTree[0]) {
      datasetTree[0].label = value
    }
    this.update({ dataset, datasetTree })
  },

  /**
   * Update Description
   *
   * Takes a key and a value and updates the dataset
   * description JSON note accordingly.
   */
  updateDescription(key, value, callback) {
    let dataset = this.data.dataset
    let metadataIssues = this.data.metadataIssues
    let description = dataset.description
    description[key] = value
    if (key !== 'Authors') {
      description.Authors = dataset.authors
    } else {
      metadataIssues.authors = null
    }

    if (key !== 'ReferencesAndLinks') {
      description.ReferencesAndLinks = dataset.referencesAndLinks
    } else {
      metadataIssues.referencesAndLinks = null
    }
    this.saveDescription(description, callback)
    this.update({ dataset, metadataIssues })
  },

  /**
   * Update Description File
   *
   * Helper method to make necessary state and metadata
   * changes after a description file is uploaded,
   * deleted or added.
   */
  updateDescriptionFile(file, projectId, callback) {
    files.read(file, contents => {
      let description = JSON.parse(contents)
      let authors = []
      let references = []
      if (description.hasOwnProperty('Authors')) {
        for (let i = 0; i < description.Authors.length; i++) {
          let author = description.Authors[i]
          authors.push(author)
        }
      }
      if (description.hasOwnProperty('ReferencesAndLinks')) {
        for (let i = 0; i < description.ReferencesAndLinks.length; i++) {
          let reference = description.ReferencesAndLinks[i]
          references.push(reference)
        }
      }
      file = new File(
        [JSON.stringify(description)],
        'dataset_description.json',
        { type: 'application/json' },
      )
      datalad.updateFile(projectId, file).then(() => {
        description.Authors = authors
        description.ReferencesAndLinks = references
        let dataset = this.data.dataset
        dataset.description = description
        this.update({ dataset })
        this.revalidate()
        callback()
      })
    })
  },

  /**
   * Save Description
   *
   * Takes a description object and upserts
   * the JSON description file.
   */
  saveDescription(description, callback) {
    description = JSON.parse(JSON.stringify(description))
    let datasetId = this.data.dataset._id
    let authors = []
    let referencesAndLinks = []

    for (let author of description.Authors) {
      authors.push(author)
    }
    description.Authors = authors

    if (description.ReferencesAndLinks) {
      for (let referencesAndLink of description.ReferencesAndLinks) {
        referencesAndLinks.push(referencesAndLink)
      }
      description.ReferencesAndLinks = referencesAndLinks
    }

    this.updateModified()
    datalad
      .updateFileFromString(
        datasetId,
        'dataset_description.json',
        JSON.stringify(description),
        'application/json',
      )
      .then(() => {
        callback()
      })
  },

  /**
   * Update README
   */
  updateREADME(value, callback) {
    let dataset = this.data.dataset
    datalad
      .updateFileFromString(this.data.dataset._id, 'README', value, '')
      .then(res => {
        callback(null, res)
        dataset.README = value
        this.update({ dataset })
        this.updateModified()
      })
  },

  /**
   * Update CHANGES
   */
  updateCHANGES(value, callback) {
    let dataset = this.data.dataset

    datalad
      .updateFileFromString(this.data.dataset._id, 'CHANGES', value, '')
      .then(res => {
        callback(null, res)
        dataset.CHANGES = value
        this.update({ dataset })
        this.updateModified()
      })
  },

  /**
   * Dismiss Metadata Issue
   */
  dismissMetadataIssue(key) {
    let metadataIssues = this.data.metadataIssues
    metadataIssues[key] = null
    this.update({ metadataIssues })
  },

  // Attachments -------------------------------------------------------------------

  /**
   * Upload Attachment
   *
   * Takes a file and a callback and uploads
   * the file to the current dataset.
   */
  uploadAttachment(file, callback) {
    let attachmentExists, fileExists
    for (let attachment of this.data.dataset.attachments) {
      if (attachment.name === file.name) {
        attachmentExists = true
      }
    }

    for (let existingFile of this.data.dataset.children) {
      if (existingFile.name === file.name) {
        fileExists = true
      }
    }

    if (attachmentExists) {
      callback({
        error:
          '"' +
          file.name +
          '" has already been uploaded. Multiple attachments with the same name are not allowed.',
      })
    } else if (fileExists) {
      callback({
        error:
          'You cannot upload a file named "' +
          file.name +
          '" as an attachment because it already exists in the dataset.',
      })
    } else {
      let request = {
        url:
          config.scitran.url + 'projects/' + this.data.dataset._id + '/files',
        file: file,
        tags: ['attachment'],
        progressStart: () => {},
        progressEnd: () => {
          bids.getDataset(this.data.dataset._id, res => {
            let dataset = this.data.dataset
            dataset.attachments = res.attachments
            this.update({ dataset: dataset })
            callback()
          })
        },
        error: () => {
          callback({
            error:
              'There was an error uploading your attachment. Please try again and contact the site administrator if the issue persists.',
          })
        },
      }
      upload.add(request)
      this.updateModified()
    }
  },

  /**
   * Delete Attachment
   *
   * Takes a filename and index and deletes
   * the attachment from the current dataset.
   */
  deleteAttachment(filename, index) {
    scitran.deleteFile('projects', this.data.dataset._id, filename).then(() => {
      let dataset = this.data.dataset
      dataset.attachments.splice(index, 1)
      this.update({ dataset })
      this.updateModified()
    })
  },

  /**
   * Get Attachment Download Ticket
   *
   * Takes a filename and callsback with a direct
   * download url for an attachment.
   */
  getAttachmentDownloadTicket(filename, callback) {
    scitran
      .getDownloadTicket('projects', this.data.dataset._id, filename, {
        snapshot: !!this.data.snapshot,
      })
      .then(res => {
        let ticket = res.body.ticket
        let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket
        callback(downloadUrl)
      })
  },

  // File Structure ----------------------------------------------------------------

  /**
   * Update Warning
   *
   * Throws a modal to warn the user about consequences of
   * dataset modifications.
   */
  updateWarn(options) {
    userActions.getPreferences(preferences => {
      if (
        preferences &&
        preferences.ignoreUpdateWarnings &&
        !options.alwaysWarn
      ) {
        options.action()
      } else {
        let modals = this.data.modals
        modals.update = true
        this.update({
          currentUpdate: {
            action: options.action,
            hideDontShow: options.hideDontShow,
            message: options.message,
            confirmTxt: options.confirmTxt,
          },
          modals,
        })
      }
    })
  },

  updateMessage(type, file) {
    return (
      <span>
        <span className="text-danger">
          You are about to {type} {file.name}
        </span>. This action will run validation again. As a result, your
        dataset could become invalid. Do you want to continue?
      </span>
    )
  },

  /**
   * Disable Update Warning
   *
   * Disables the update warning modal
   */
  disableUpdateWarn(callback) {
    userActions.updatePreferences({ ignoreUpdateWarnings: true }, callback)
  },

  /**
   * Add File
   */
  addFile(container, file) {
    let exists
    for (let existingFile of container.children) {
      if (
        existingFile.name.split('/')[
          existingFile.name.split('/').length - 1
        ] === file.name
      ) {
        exists = true
      }
    }

    if (exists) {
      this.updateDirectoryState(container._id, {
        error: '"' + file.name + '" already exists in this directory.',
      })
    } else {
      let message = this.updateMessage('add', file)
      this.updateWarn({
        message: message,
        action: () => {
          this.updateDirectoryState(container._id, { loading: true })
          if (
            file.name === 'dataset_description.json' &&
            container.hasOwnProperty('group')
          ) {
            this.updateDescriptionFile(file, container._id, () => {
              let children = container.children
              children.unshift({
                filename: file.name,
                name: file.name,
                parentContainer: container.containerType,
                parentId: container._id,
              })
              this.updateDirectoryState(container._id, {
                children: children,
                loading: false,
              })
            })
          } else {
            file.modifiedName = (container.dirPath || '') + file.name
            datalad.updateFile(this.data.dataset._id, file).then(() => {
              let children = container.children
              children.unshift({
                name: file.modifiedName,
                parentId: container._id,
              })
              this.updateDirectoryState(container._id, {
                children: children,
                loading: false,
              })
              this.revalidate()
            })
          }
        },
      })
    }
  },

  addDirectoryFile(uploads, dirTree, callback) {
    // get the top level directory name to display in warning message
    let topLevelDirectory = `${uploads[0].container.dirPath.split('/')[0]}/`
    let datasetId = this.data.dataset._id
    let childExistsIndex = this.data.dataset.children.findIndex(el => {
      return el.name === dirTree.name
    })
    if (childExistsIndex === -1) {
      let message = this.updateMessage('add directory', {
        name: topLevelDirectory,
      })
      this.updateWarn({
        message: message,
        action: () => {
          this.updateDirectoryState(datasetId, { loading: true })
          datalad
            .addDirectory(datasetId, uploads)
            .then(() => {
              this.update({ uploading: false })
              // Reset canceled when an upload is done (canceled or otherwise)
              this.update({ uploadingCanceled: false })
              if (callback) callback()
            })
            .catch(err => {
              if (callback) {
                callback(err)
              }
            })
        },
      })
    } else {
      this.updateDirectoryState(datasetId, {
        error: '"' + topLevelDirectory + '" already exists in this dataset.',
      })
    }
  },

  cancelDirectoryUpload() {
    this.data.uploadingScitranRequests.forEach(upload => {
      upload.abort()
    })
    // Reset the uploading state
    this.update({
      uploading: false,
      uploadingProgress: null,
      uploadingFileCount: 0,
      uploadingCanceled: true,
      uploadingScitranRequests: [],
    })
  },

  deleteDirectory(dirTree, label, callback) {
    let fileList = files.findFiles(dirTree)
    if (fileList.length) {
      let message = this.updateMessage('delete directory', {
        name: label + '/',
      })
      this.updateWarn({
        message: message,
        action: () => {
          this.updateDirectoryState(this.data.dataset._id, { loading: true })
          datalad
            .deleteDirectory(
              bids.decodeId(this.data.dataset._id),
              dirTree.dirPath,
            )
            .then(() => {
              // TODO: ADD FUNCTIONALITY FOR HANDLING SUCCESSFUL DATASET DIRECTORY DELETION
              // this.loadDataset(bids.decodeId(this.data.dataset._id), undefined, true) // reload dataset
            })
        },
      })
    } else {
      this.updateDirectoryState(this.data.dataset._id, {
        error: 'The directory you have selected is empty',
      })
    }
    if (callback) {
      callback()
    }
  },

  /**
   * Delete File
   */
  deleteFile(file, callback) {
    let message = this.updateMessage('delete', file)
    let modifiedName = file.name
    let name = file.name.split('/').slice(-1)[0]
    if (modifiedName !== name) {
      file.modifiedName = modifiedName
      file.name = name
    }
    this.updateWarn({
      message: message,
      action: () => {
        let dataset = this.data.dataset
        this.updateDirectoryState(this.data.dataset._id, { loading: true })
        datalad.deleteFile(this.data.dataset._id, file).then(() => {
          let match = files.findInTree([dataset], file.parentId)
          let children = []
          for (let existingFile of match.children) {
            if (file.name !== existingFile.name) {
              children.push(existingFile)
            }
          }
          match.children = children
          if (file.name === 'dataset_description.json') {
            dataset.description = {
              Name: '',
              License: '',
              Authors: [],
              Acknowledgements: '',
              HowToAcknowledge: '',
              Funding: '',
              ReferencesAndLinks: [],
              DatasetDOI: '',
            }
          }
          this.update({ dataset })
        })
      },
    })
    if (callback) {
      callback()
    }
  },

  /**
   * Update File
   */
  updateFile(item, file) {
    if (!item.name.endsWith(file.name)) {
      this.updateFileState(item, {
        error: 'You must replace a file with a file of the same name.',
      })
    } else {
      // Handle a subdir file add by prepending directory name
      if (file.name !== item.name) {
        // modifiedName is writable and handled in scitran.updateFile
        file.modifiedName = item.name
      }
      const message = this.updateMessage('update', file)
      this.updateWarn({
        message: message,
        action: () => {
          this.updateFileState(item, { error: null, loading: true })
          if (file.name === 'dataset_description.json') {
            this.updateDescriptionFile(file, this.data.dataset._id, () => {
              this.updateFileState(item, { loading: false })
              this.showDatasetComponent('', item.history)
            })
          } else {
            datalad
              .updateFile(bids.decodeId(this.data.dataset._id), file)
              .then(() => {
                this.updateFileState(item, { loading: false })
                this.showDatasetComponent('', item.history)
                this.revalidate()
              })
          }
        },
      })
    }
  },

  /**
   * Re Validate
   *
   * Used after any modification and must be run
   * only after the modification is complete. Downloads
   * and validates the dataset server side. Updates status
   * tags and validation results on dataset.
   */
  revalidate() {
    let dataset = this.data.dataset
    scitran
      .addTag('projects', dataset._id, 'validating')
      .then(() => {
        dataset.status.validating = true
        this.update({ dataset })
        return crn.validate(dataset._id).then(res => {
          let validation = res.body && res.body.validation
          dataset.status.validating = false
          dataset.validation = validation
          dataset.summary = res.body && res.body.summary
          dataset.status.invalid =
            validation &&
            validation.errors &&
            (validation.errors == 'Invalid' || validation.errors.length > 0)
          this.update({ dataset })
          this.updateModified()
        })
      })
      .catch(() => {
        if (dataset.status.validating) {
          scitran.removeTag('projects', dataset._id, 'validating')
          dataset.status.validating = false
          this.update({ dataset })
        }
      })
  },

  /**
   * Get File Download Ticket
   *
   * Takes a filename and callsback with a
   * direct download url.
   */
  getFileDownloadTicket(file, callback) {
    let isSnapshot =
      this.data.dataset && this.data.dataset && this.data.dataset.linkOriginal
        ? true
        : false

    scitran
      .getDownloadTicket('projects', this.data.dataset._id, file.name, {
        snapshot: isSnapshot,
      })
      .then(res => {
        let ticket = res.body.ticket
        let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket
        callback(downloadUrl)
      })
      .catch(err => {
        this.update({
          status: err.status,
        })
        callback()
      })
  },

  /**
   * Dismiss Error
   */
  dismissError(item) {
    if (item.children) {
      this.updateDirectoryState(item._id, { error: '' })
    } else {
      this.updateFileState(item, { error: '' })
    }
  },

  /**
   * Update Directory State
   *
   */
  updateDirectoryState(directoryId, changes, callback) {
    let dataset = this.data.dataset
    let match = files.findInTree([dataset], directoryId)
    if (match) {
      for (let key in changes) {
        match[key] = changes[key]
      }
    }
    this.update({ dataset }, callback)
  },

  updateFileTreeOnDeleteDir(directoryName, callback) {
    let dataset = this.data.dataset
    dataset.children = dataset.children.filter(child => {
      return child.name != directoryName
    })

    this.update({ dataset }, callback)
  },
  /**
   * Update File State
   *
   * Take a file object and changes to be
   * made and applies those changes by
   * updating the state of the file tree
   */
  updateFileState(file, changes, callback) {
    let dataset = this.data.dataset
    let parent = files.findInTree([dataset], file.parentId)
    for (let existingFile of parent.children) {
      if (file.name == existingFile.name) {
        for (let key in changes) {
          existingFile[key] = changes[key]
        }
      }
    }
    this.update({ dataset }, callback)
  },

  /**
   * Toggle Folder
   *
   * Takes the id of a container in the
   * current dataset and toggles its showChildren
   * boolean which determines whether container
   * children are shown in the tree hierarchy UI.
   */
  toggleFolder(directory) {
    if (directory.label === this.data.dataset.label && !this.data.datasetTree) {
      this.loadDatasetTree()
    } else {
      this.updateDirectoryState(directory._id, {
        showChildren: !directory.showChildren,
      })
    }
  },

  toggleResultFolder(directory, jobId) {
    // determine job run
    let jobs = this.data.jobs
    let jobRun
    for (let job of jobs) {
      for (let version of job.versions) {
        for (let run of version.runs) {
          if (jobId === run._id) {
            jobRun = run
          }
        }
      }
    }

    // find directory
    let dir = files.findInTree(jobRun.results, directory.dirPath, 'dirPath')
    if (dir) {
      dir.showChildren = !dir.showChildren
    }
    // update state
    this.update({ jobs })
  },

  // Jobs --------------------------------------------------------------------------

  /**
   * Load Jobs
   */
  loadJobs(projectId, snapshot, originalId, options, callback) {
    if (!config.analysis.enabled) {
      return callback(null, [])
    }
    let jobId = options.job
    this.update({ loadingJobs: true })
    crn
      .getDatasetJobs(projectId, { snapshot })
      .then(res => {
        let jobs = {}

        // iterate jobs
        for (let job of res.body) {
          files.sortTree(job.results)
          files.sortTree(job.logs)

          // check if job should be polled
          let status = job.analysis ? job.analysis.status : 'PENDING'
          let failed = status === 'FAILED'
          let finished = status === 'SUCCEEDED'
          let hasResults = job.results && job.results.length > 0
          if (
            snapshot &&
            ((!finished && !failed) || (finished && !hasResults))
          ) {
            this.pollJob(job._id, projectId)
          }

          if (job.jobId === jobId) {
            job.active = true
          }

          // sort jobs by label and version
          if (!jobs.hasOwnProperty(job.appLabel)) {
            jobs[job.appLabel] = {}
            jobs[job.appLabel][job.appVersion] = {
              appId: job.appId,
              appLabel: job.appLabel,
              appVersion: job.appVersion,
              runs: [job],
            }
          } else if (!jobs[job.appLabel].hasOwnProperty(job.appVersion)) {
            jobs[job.appLabel][job.appVersion] = {
              appId: job.appId,
              appLabel: job.appLabel,
              appVersion: job.appVersion,
              runs: [job],
            }
          } else {
            jobs[job.appLabel][job.appVersion].runs.push(job)
          }
        }

        function jobsToArray(jobs) {
          let arr = []
          for (let app in jobs) {
            arr.push({
              label: app,
              versions: versionsToArray(jobs[app]),
            })
          }
          return arr
        }

        function versionsToArray(versions) {
          let arr = []
          for (let version in versions) {
            arr.push({
              label: version,
              runs: versions[version].runs,
            })
          }
          return arr
        }

        let jobArray = jobsToArray(jobs)

        // update jobs state
        this.update({ jobs: jobArray, loadingJobs: false })

        // callback with original jobs array
        if (snapshot && callback) {
          crn
            .getDatasetJobs(originalId, { snapshot: false })
            .then(res => {
              callback(null, res.body)
            })
            .catch(err => {
              callback(err, null)
            })
        } else if (callback) {
          callback(null, res.body)
        }
      })
      .catch(err => {
        callback(err, null)
      })
  },

  pollJob(jobId, snapshotId) {
    let poll = jobId => {
      if (this.data.dataset && this.data.dataset._id === snapshotId) {
        this.refreshJob(jobId, job => {
          let status = job.analysis ? job.analysis.status : 'PENDING'
          let finished = status === 'SUCCEEDED'
          let failed = status === 'FAILED' || status === 'REJECTED'
          let hasResults = job.results && job.results.length > 0
          let needsUpdate = (!finished && !failed) || (finished && !hasResults)

          if (
            needsUpdate &&
            this.data.dataset &&
            job.snapshotId === this.data.dataset._id
          ) {
            let interval = this._getInterval(20000, 40000) // random interval between 20 and 40 seconds
            setTimeout(poll.bind(this, jobId), interval)
          }
        })
      }
    }
    poll(jobId)
  },

  prepareJobSubmission(parameters, inputFileParameters, callback) {
    if (
      Object.keys(inputFileParameters) &&
      Object.keys(inputFileParameters).length > 0
    ) {
      let filesToUpload = []

      Object.keys(inputFileParameters).forEach(param => {
        let file = {
          file: inputFileParameters[param],
          key: param,
        }
        filesToUpload.push(file)
      })
      let uploadFunc = crn.uploadParamFile.bind(null, parameters)
      async.each(filesToUpload, uploadFunc, err => {
        if (err) return callback(err)
        callback(null, parameters)
      })
    } else {
      callback(null, parameters)
    }
  },
  /**
   * Start Job
   */
  startJob(snapshotId, jobDefinition, parameters, callback) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id

    // If the participant_label parameter exists and has no value, use all subjects
    if (
      parameters.hasOwnProperty('participant_label') &&
      (parameters.participant_label.length === 0 ||
        (parameters.participant_label.length === 1 &&
          parameters.participant_label[0] === ''))
    ) {
      parameters.participant_label = this.data.dataset.summary.subjects
    }

    crn
      .createJob({
        datasetId: datasetId,
        datasetLabel: this.data.dataset.label,
        jobDefinition: jobDefinition.jobDefinitionArn,
        jobName: jobDefinition.jobDefinitionName,
        parameters: parameters,
        snapshotId: snapshotId,
        userId: userStore.data.scitran._id,
      })
      .then(res => {
        // reload jobs
        if (snapshotId == this.data.dataset._id) {
          let jobId = res.body.jobId
          this.loadJobs(
            snapshotId,
            this.data.snapshot,
            datasetId,
            { job: jobId },
            (err, jobs) => {
              this.loadSnapshots(this.data.dataset, jobs)

              // start polling job
              this.pollJob(jobId, snapshotId)

              // open job accordion
              this.update({
                activeJob: {
                  app: jobDefinition.label,
                  version: jobDefinition.version,
                },
              })
            },
          )
        }
        callback(null, res)
      })
      .catch(err => {
        callback(err)
      })
  },

  cancelJob(job) {
    let datasetId = job.datasetId
    let jobId = job._id
    crn.cancelJob(datasetId, jobId)
  },

  refreshJob(jobId, callback) {
    if (this.data.dataset) {
      crn.getJob(this.data.dataset._id, jobId, { snapshot: true }).then(res => {
        let existingJob
        let jobUpdate = res ? res.body : null
        let jobs = this.data.jobs
        if (jobs && jobs.length > 0) {
          for (let job of jobs) {
            for (let version of job.versions) {
              for (let run of version.runs) {
                if (jobId === run._id) {
                  existingJob = run
                  if (jobUpdate) {
                    run.analysis = jobUpdate.analysis
                    run.results = jobUpdate.results
                    run.logs = jobUpdate.logs
                  }
                }
              }
            }
          }
          if (
            this.data.dataset &&
            jobUpdate &&
            this.data.dataset._id === jobUpdate.snapshotId
          ) {
            this.update({ jobs })
          }
        }
        callback(jobUpdate ? jobUpdate : existingJob)
      })
    }
  },

  retryJob(jobId, callback) {
    crn
      .retryJob(this.data.dataset._id, jobId, { snapshot: this.data.snapshot })
      .then(() => {
        this.loadJobs(
          this.data.dataset._id,
          true,
          this.data.dataset.original,
          {},
          (err, jobs) => {
            this.loadSnapshots(this.data.dataset, jobs)

            // start polling job
            this.pollJob(jobId, this.data.selectedSnapshot)
            callback()
          },
        )
      })
  },

  deleteJob(jobId, callback) {
    crn
      .deleteJob(this.data.dataset._id, jobId, { snapshot: this.data.snapshot })
      .then(() => {
        this.loadJobs(
          this.data.dataset._id,
          true,
          this.data.dataset.original,
          {},
          (err, jobs) => {
            this.loadSnapshots(this.data.dataset, jobs)

            // start polling job
            this.pollJob(jobId, this.data.selectedSnapshot)
            callback()
          },
        )
      })
  },

  /**
   * Dismiss Job Modal
   */
  dismissJobsModal(success, snapshotId, appLabel, appVersion, jobId, history) {
    this.toggleModal('jobs')
    if (success) {
      if (snapshotId !== this.data.dataset._id) {
        let datasetId = this.data.dataset.original
          ? this.data.dataset.original
          : this.data.dataset._id
        const base = '/datasets/' + datasetId + '/versions/' + snapshotId
        const query = { app: appLabel, version: appVersion, job: jobId }
        const url = base + querystring(query)
        history.push(url)
      }
    }
  },

  /**
   * Select Job
   *
   * Select the job accordion panel and saves
   * the state.
   */
  selectJob(type, value) {
    let activeJob = this.data.activeJob
    if (value === activeJob[type]) {
      activeJob[type] = false
    } else {
      activeJob[type] = value
      if (type === 'app') {
        activeJob.version = false
      }
    }

    this.update(activeJob)
  },

  /**
   * Get Result Download Ticket
   */
  getResultDownloadTicket(snapshotId, jobId, file, callback) {
    let filePath = file === 'all' ? file : file.path
    if (filePath === 'all-results') {
      let downloadUrl =
        config.crn.url +
        'jobs/' +
        jobId +
        '/results/' +
        'fileName' +
        '?ticket=' +
        'ticket'
      callback(downloadUrl)
    } else {
      callback('https://s3.amazonaws.com/' + filePath)
    }
  },

  /**
   * DisplayFile
   */
  displayFile(snapshotId, jobId, file, history, callback) {
    if (file && file.name) {
      let displayUrl = file.path ? 'results/' + file.path : 'file-display'
      let link = files.getFileURL(this.data.dataset, file.name)
      if (
        files.hasExtension(file.name, [
          '.pdf',
          '.nii.gz',
          '.jpg',
          '.jpeg',
          '.png',
          '.gif',
        ])
      ) {
        let displayFile = {
          name: file.name,
          text: null,
          link: link,
        }
        this.update({ displayFile: displayFile }, () => {
          this.showDatasetComponent(displayUrl, file.history)
        })
      } else {
        let options = {}
        options.snapshot = this.data.dataset.snapshot_version ? true : false
        options.tag = options.snapshot
          ? this.data.dataset.snapshot_version
          : null
        datalad
          .getFile(bids.decodeId(this.data.dataset._id), file.name, options)
          .then(res => {
            if (callback) {
              callback()
            }
            let displayFile = {
              name: file.name,
              text: res.text,
              link: link,
              info: file,
            }
            this.update({ displayFile: displayFile }, () => {
              this.showDatasetComponent(displayUrl, file.history)
            })
          })
        // .catch(err => {
        //   console.log(err)
        // })
      }
    } else {
      callback()
    }
  },

  /**
   * EditFile
   *
   * Toggles the editFile modal for files of type .json, .tsv, .csv
   */
  editFile(snapshotId, jobId, file, callback) {
    let link = files.getFileURL(this.data.dataset, file.name)
    if (files.hasExtension(file.name, ['.json', '.csv', '.tsv'])) {
      datalad
        .getFile(bids.decodeId(this.data.dataset._id), file.name)
        .then(res => {
          if (callback) {
            callback()
          }
          let editFile = {
            name: file.name,
            text: res.text,
            link: link,
            info: file,
          }
          this.update({ editFile: editFile }, () => {
            this.showDatasetComponent('file-edit', file.history)
          })
        })
      // .catch(err => {
      //   console.log(err)
      // })
    }
  },

  // Snapshots ---------------------------------------------------------------------

  createSnapshot(changes, tag, history, callback, transition) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    transition = transition == undefined ? true : transition

    bids.getDataset(
      datasetId,
      data => {
        let project = data
        if (!project.authors || project.length < 1) {
          let metadataIssues = this.data.metadataIssues
          let message =
            'Your dataset must list at least one author before creating a snapshot.'
          metadataIssues.authors = message
          this.update({ metadataIssues })
          callback({ error: message })
        } else if (
          project.hasOwnProperty('validation') &&
          project.validation.errors.length > 0
        ) {
          callback({
            error:
              'You cannot snapshot an invalid dataset. Please fix the errors and try again.',
          })
        } else {
          let latestSnapshot = this.data.snapshots[0]
          if (
            latestSnapshot &&
            latestSnapshot.created &&
            moment(this.data.dataset.modified).diff(
              moment(latestSnapshot.created),
            ) <= 0
          ) {
            callback({
              error:
                'No modifications have been made since the last snapshot was created. Please use the most recent snapshot.',
            })
          } else {
            this.updateCHANGES(changes, err => {
              if (err) {
                callback({
                  error: err,
                })
              } else {
                if (!data) {
                  callback({
                    error:
                      'There was an error while updating the dataset changelog.',
                  })
                }
                let newVersion = tag
                this.update({
                  loading: true,
                })
                datalad.createSnapshot(datasetId, newVersion).then(res => {
                  let snapshotId = res.data.createSnapshot.tag
                  this.toggleSidebar(true)
                  this.update({
                    loading: false,
                  })
                  if (transition) {
                    const url =
                      '/datasets/' + bids.decodeId(this.data.dataset._id)
                    history.push(url)
                  }

                  this.loadSnapshots(this.data.dataset, [], () => {
                    if (callback) {
                      callback(snapshotId)
                    }
                  })
                })
              }
            })
          }
        }
      },
      {},
    )
  },

  loadSnapshots(dataset, jobs, callback) {
    let datasetId = dataset.original ? dataset.original : dataset._id
    let snapshots = dataset.snapshots ? dataset.snapshots.slice(0) : []
    if (snapshots.length) {
      // sort snapshots
      snapshots.sort((a, b) => {
        if (a.created < b.created) {
          return 1
        } else if (a.created > b.created) {
          return -1
        } else {
          return 0
        }
      })

      // add job counts
      for (let snapshot of snapshots) {
        let snap = Object.assign({}, snapshot)
        snap.analysisCount = 0
        snap.linkID = bids.decodeId(snap._id)
        snap.linkOriginal = bids.decodeId(snap.original)
        if (jobs && !jobs.error) {
          for (let job of jobs) {
            if (job.snapshotId == snap._id) {
              snap.analysisCount++
            }
          }
        }
        snapshot = snap
      }
    }
    // add draft if available
    if (
      dataset &&
      this.data.currentUser &&
      this.data.currentUser.profile &&
      dataset.user &&
      dataset.user._id === this.data.currentUser.profile._id &&
      dataset.permissions &&
      !dataset.permissions.length
    ) {
      snapshots.unshift({
        orphaned: true,
      })
    } else if (dataset && dataset.access !== null) {
      snapshots.unshift({
        isOriginal: true,
        _id: datasetId,
        linkID: bids.decodeId(datasetId),
      })
    }
    this.update({ snapshots: snapshots })
    if (callback) {
      callback()
    }
  },

  constructDatasetUrl(dataset) {
    if (dataset) {
      let datasetId = bids.decodeId(dataset._id)
      if (!dataset.snapshot_version) {
        return '/datasets/' + datasetId
      } else {
        let version = dataset.snapshot_version
        return '/datasets/' + datasetId + '/versions/' + version
      }
    }
  },

  // usage analytics ---------------------------------------------------------------

  trackView(snapshotId) {
    scitran.trackUsage(snapshotId, 'view', { snapshot: true })
  },

  toggleSidebar(value) {
    let showSidebar = !this.data.showSidebar
    if (typeof value === 'boolean') {
      showSidebar = value
    }
    window.localStorage.showSidebar = showSidebar
    this.update({ showSidebar })
  },

  _getInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  // Comments  ----------------------------------------------------------------

  loadComments(datasetId) {
    crn.getComments(bids.decodeId(datasetId)).then(res => {
      if (res && (res.status === 404 || res.status === 403)) {
        this.update({
          commentTree: [],
          comments: [],
        })
      } else {
        let comments = res.body
        this.createCommentTree(comments)
        this.sortComments()
        this.update({
          comments: comments,
          content: '',
        })
      }
    })
  },

  createComment(content, parent) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id

    let datasetLabel = this.data.dataset ? this.data.dataset.label : null

    const parentId = typeof parent === 'undefined' ? null : parent

    const comment = {
      datasetId: bids.decodeId(datasetId),
      datasetLabel: datasetLabel,
      parentId: parentId,
      text: content,
      user: this.data.currentUser.profile,
      createDate: moment().format(),
    }

    crn.createComment(bids.decodeId(datasetId), comment).then(res => {
      if (res) {
        if (res.status === 200 && res.ok) {
          this.loadComments(bids.decodeId(datasetId))
        }
      }
    })
  },

  updateComment(commentId, content) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id

    const comment = {
      commentId: commentId,
      text: content,
    }
    crn
      .updateComment(bids.decodeId(datasetId), commentId, comment)
      .then(res => {
        if (res) {
          if (res.status === 200 && res.ok) {
            this.loadComments(datasetId)
          }
        }
      })
  },

  deleteComment(commentId, parent, callback) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id

    const parentId = typeof parent == undefined ? null : parent

    const comment = {
      commentId: commentId,
      parentId: parentId,
    }
    crn.deleteComment(comment).then(res => {
      if (res) {
        if (res.status === 200 && res.ok) {
          this.loadComments(bids.decodeId(datasetId))
          if (callback) {
            callback()
          }
        }
      }
    })
  },

  sortComments(e) {
    let commentTree
    let commentSortOrder = e
      ? e.currentTarget.value
      : this.data.commentSortOrder
    if (commentSortOrder === 'ASC') {
      commentTree = this.data.commentTree.sort((a, b) => {
        return a.createDate < b.createDate
      })
    } else {
      commentTree = this.data.commentTree.sort((a, b) => {
        return a.createDate > b.createDate
      })
    }
    this.update({
      commentSortOrder: commentSortOrder,
      commentTree: commentTree,
    })
  },

  createCommentTree(comments) {
    let map = {}
    let node = []
    let roots = []

    for (let i = 0; i < comments.length; i += 1) {
      map[comments[i]._id] = i
      comments[i].children = []
    }
    for (let j = 0; j < comments.length; j += 1) {
      node = comments[j]
      if (node.parentId !== null) {
        if (map[node.parentId] !== undefined) {
          comments[map[node.parentId]].children.push(node)
        }
      } else {
        roots.push(node)
      }
    }
    this.update({
      commentTree: roots,
    })
  },

  // subscriptions ---------------------------------------------------------------
  createSubscription(callback) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    let userId =
      this.data.currentUser && this.data.currentUser.profile
        ? this.data.currentUser.profile._id
        : null
    crn.createSubscription(bids.decodeId(datasetId), userId).then(res => {
      if (res && res.status !== 200) {
        callback({ error: 'There was an error while following this dataset.' })
      } else {
        this.checkSubscriptionFollowers(() => {
          callback()
        })
      }
    })
  },

  deleteSubscription(callback) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    let userId =
      this.data.currentUser && this.data.currentUser.profile
        ? this.data.currentUser.profile._id
        : null
    crn.deleteSubscription(bids.decodeId(datasetId), userId).then(res => {
      if (res && res.status !== 200) {
        callback({
          error: 'There was an error while unfollowing this dataset.',
        })
      } else {
        this.checkSubscriptionFollowers(() => {
          callback()
        })
      }
    })
  },

  checkUserSubscription(callback) {
    let dataset = this.data.dataset
    let userId =
      this.data.currentUser && this.data.currentUser.profile
        ? this.data.currentUser.profile._id
        : null
    let ownerId = this.data.dataset.group ? this.data.dataset.group : null
    if (dataset.followersList) {
      let userSubscription = dataset.followersList.filter(follower => {
        return follower.userId === userId
      })
      let ownerSubscription = dataset.followersList.filter(follower => {
        return follower.userId === ownerId
      })
      dataset.subscribed = userSubscription.length ? true : false
      dataset.uploaderSubscribed = ownerSubscription.length ? true : false
      this.update({ dataset }, callback())
    } else {
      callback()
    }
  },

  checkSubscriptionFollowers(callback) {
    let dataset = this.data.dataset
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    crn.getSubscriptions(bids.decodeId(datasetId)).then(res => {
      dataset.followersList = res.body || []
      dataset.followers = res.body ? res.body.length : '0'
      this.update(
        { dataset },
        this.checkUserSubscription(() => {
          callback()
        }),
      )
    })
  },

  // stars ----------------------------------------------------------------
  addStar(callback) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    let userId =
      this.data.currentUser && this.data.currentUser.profile
        ? this.data.currentUser.profile._id
        : null
    crn.addStar(bids.decodeId(datasetId), userId).then(res => {
      if (res && res.status !== 200) {
        callback({
          error: 'There was an error while adding a star to this dataset.',
        })
      } else {
        this.getDatasetStars(() => {
          callback()
        })
      }
    })
  },

  removeStar(callback) {
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    let userId =
      this.data.currentUser && this.data.currentUser.profile
        ? this.data.currentUser.profile._id
        : null
    crn.removeStar(bids.decodeId(datasetId), userId).then(res => {
      if (res && res.status !== 200) {
        callback({
          error: 'There was an error while removing a star from this dataset.',
        })
      } else {
        this.getDatasetStars(() => {
          callback()
        })
      }
    })
  },

  getDatasetStars(callback) {
    let dataset = this.data.dataset
    let datasetId = this.data.dataset.original
      ? this.data.dataset.original
      : this.data.dataset._id
    let userId =
      this.data.currentUser && this.data.currentUser.profile
        ? this.data.currentUser.profile._id
        : null
    crn.getStars(bids.decodeId(datasetId)).then(res => {
      if (res && res.status !== 200) {
        let dataset = this.data.dataset
        dataset.stars = []
        dataset.hasUserStar = false
        this.update({ dataset }, callback)
      } else {
        dataset.stars = res.body ? res.body : []

        if (dataset.stars.length) {
          dataset.hasUserStar =
            dataset.stars.filter(star => {
              return star.userId === userId
            }).length > 0
        } else {
          dataset.hasUserStar = false
        }
        this.update({ dataset }, callback)
      }
    })
  },

  // dois----------------------------------------------------------------
  registerDoi(callback) {
    let dataset = this.data.dataset
    if (!dataset.original) {
      if (callback) {
        return callback({ error: 'Can not mint DOI for draft.' })
      } else {
        return
      }
    }
    let snapshotId = this.data.dataset._id
    crn.registerDoi(snapshotId).then(res => {
      if (res) {
        dataset.description.DatasetDOI = res.body.doi
        this.update({ dataset })
      }
      if (!callback && res) {
        return res.body.doi
      }
      callback()
    })
  },
})

export default datasetStore
