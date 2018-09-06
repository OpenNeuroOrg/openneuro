import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import UploaderContext from './uploader-context.js'
import notifications from '../notification/notification.actions'
import { locationFactory } from './uploader-location.js'
import * as mutation from './upload-mutation.js'
import getClient, { datasets } from 'openneuro-client'
import config from '../../../config'
import { xhrFetch } from './xhrfetch.js'
import { withRouter } from 'react-router-dom'

/**
 * Stateful uploader workflow and status
 *
 * Usable from anywhere, so this button sets up a modal and
 * virtual router to navigate within it.
 */
class UploadClient extends React.Component {
  constructor(props) {
    super(props)

    this.setLocation = this.setLocation.bind(this)
    this.setName = this.setName.bind(this)
    this.resumeDataset = this.resumeDataset.bind(this)
    this.selectFiles = this.selectFiles.bind(this)
    this.upload = this.upload.bind(this)
    this.uploadProgress = this.uploadProgress.bind(this)
    this.uploadCompleteAction = this.uploadCompleteAction.bind(this)
    this.cancel = this.cancel.bind(this)

    this.state = {
      // An upload is processing
      uploading: false,
      // Which step in the modal
      location: locationFactory('/hidden'),
      // List of files being uploaded
      files: {},
      // Files selected, regardless of if they will be uploaded
      selectedFiles: {},
      // Relabel dataset during upload
      name: '',
      progress: 0,
      // Resume an existing dataset
      resume: null,
      // Allow context consumers to change routes
      setLocation: this.setLocation,
      // Rename on upload (optionally)
      setName: this.setName,
      // Set a dataset to resume upload for
      resumeDataset: this.resumeDataset,
      // Get files from the browser
      selectFiles: this.selectFiles,
      // Start an upload
      upload: this.upload,
      // Upload XHR request
      xhr: null,
      // Id of the uploaded dataset
      datasetId: null,
      // Cancel current upload
      cancel: this.cancel,
    }
  }

  /**
   * Change to a new step in upload setup
   *
   * @param {string} path Virtual router path for upload modal
   */
  setLocation(path) {
    this.setState({ location: locationFactory(path) })
  }

  /**
   * Change the dataset name/label on upload
   * @param {string} name
   */
  setName(e) {
    this.setState({ name: e.target.value })
  }

  /**
   * Specify a dataset to resume upload for
   * @param {string} datasetId
   */
  resumeDataset(datasetId) {
    return ({ files }) => {
      this.props.client
        .query({
          query: datasets.getUntrackedFiles,
          variables: { id: datasetId },
        })
        .then(({ data }) => {
          // Create a new array of files to upload
          const filesToUpload = []
          // Create hashmap of filename -> size
          const existingFiles = data.dataset.draft.files.reduce(
            (existingFiles, f) => {
              existingFiles[f.filename] = f.size
              return existingFiles
            },
            {},
          )
          for (const newFile of files) {
            const newFilePath = newFile.webkitRelativePath.split(/\/(.*)/)[1]
            // Skip any existing files
            if (existingFiles[newFilePath] !== newFile.size) {
              filesToUpload.push(newFile)
            }
          }
          this.setState({
            datasetId,
            resume: true,
            files: filesToUpload,
            selectedFiles: files,
            location: locationFactory('/upload/issues'),
          })
        })
    }
  }

  /**
   * Select the files for upload
   * @param {object} event onChange event from multi file select
   */
  selectFiles({ files }) {
    if (files.length > 0) {
      this.setState({
        files,
        selectedFiles: files,
        location: locationFactory('/upload/rename'),
        name: files[0].webkitRelativePath.split('/')[0],
      })
    } else {
      throw new Error('No files selected')
    }
  }

  upload() {
    this.setState({
      uploading: true,
      location: locationFactory('/hidden'),
    })
    if (this.state.resume && this.state.datasetId) {
      // Just add files since this is an existing dataset
      this._addFiles()
    } else {
      // Create dataset and then add files
      mutation
        .createDataset(this.props.client)(this.state.name)
        .then(datasetId => {
          // Note chain to this._addFiles
          this.setState({ datasetId }, this._addFiles)
        })
    }
  }

  /**
   * Do the actual upload
   */
  _addFiles() {
    // This is an upload specific apollo client to record progress
    // Uses XHR since Fetch does not provide the required interface
    const uploadClient = getClient(
      `${config.url}/crn/graphql`,
      null,
      xhrFetch(this),
    )
    return mutation
      .updateFiles(uploadClient)(this.state.datasetId, this.state.files)
      .then(() => {
        this.props.client
          .query({
            query: datasets.getDataset,
            variables: {
              id: this.state.datasetId,
            },
          })
          .then(() => {
            this.setState({ uploading: false })
            this.uploadCompleteAction()
          })
          .catch(() => {
            this.setState({ uploading: false })
          })
      })
  }

  uploadCompleteAction() {
    let datasetURL = `/datasets/${this.state.datasetId}`
    if (this.state.location.pathname !== locationFactory('/hidden').pathname) {
      this.props.history.push(datasetURL)
      this.setLocation('/hidden')
    } else {
      notifications.createAlert({
        type: 'Success',
        message: (
          <span>
            {' '}
            Dataset successfully uploaded.{' '}
            <a href={datasetURL}>Click here to browse your dataset.</a>
          </span>
        ),
      })
    }
  }

  uploadProgress(e) {
    this.setState({
      progress: e.total > 0 ? Math.floor((e.loaded / e.total) * 100) : 0,
    })
  }

  cancel() {
    this.state.xhr.abort()
    this.setState({ uploading: false, progress: 0 })
  }

  render() {
    return (
      <UploaderContext.Provider value={this.state}>
        {this.props.children}
      </UploaderContext.Provider>
    )
  }
}

UploadClient.propTypes = {
  client: PropTypes.object,
  history: PropTypes.object,
  children: PropTypes.element,
}

const UploadClientWithRouter = withRouter(UploadClient)

const Uploader = ({ children }) => (
  <ApolloConsumer>
    {client => (
      <div className="uploader">
        <UploadClientWithRouter client={client}>
          {children}
        </UploadClientWithRouter>
      </div>
    )}
  </ApolloConsumer>
)

Uploader.propTypes = {
  children: PropTypes.element,
}

export default Uploader
