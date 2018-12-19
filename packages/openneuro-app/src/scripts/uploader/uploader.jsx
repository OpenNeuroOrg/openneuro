import Raven from 'raven-js'
import { toast } from 'react-toastify'
import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import ReactGA from 'react-ga'
import UploaderContext from './uploader-context.js'
import FileSelect from '../common/forms/file-select.jsx'
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
export class UploadClient extends React.Component {
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
      // Dataset description - null if it doesn't exist
      description: null,
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
    ReactGA.pageview(path)
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
          })
          this.setLocation('/upload/issues')
        })
    }
  }

  /**
   * Select the files for upload
   * @param {object} event onChange event from multi file select
   */
  selectFiles({ files }) {
    // First get the name from dataset_description.json
    return new Promise(resolve => {
      const descriptionFile = [...files].find(
        f => f.name === 'dataset_description.json',
      )
      if (!descriptionFile) {
        // Use directory name if no dataset_description
        resolve(files[0].webkitRelativePath.split('/')[0])
      }
      const descriptionReader = new FileReader()
      descriptionReader.onload = event => {
        try {
          // Read Name field from dataset_description.json
          const description = JSON.parse(event.target.result)
          // Save description to state for writing later
          this.setState({ description })
          resolve(description.Name)
        } catch (e) {
          // Fallback to directory name if JSON parse failed
          resolve(files[0].webkitRelativePath.split('/')[0])
        }
      }
      descriptionReader.readAsText(descriptionFile)
    }).then(name => {
      if (files.length > 0) {
        this.setState({
          files,
          selectedFiles: files,
          name,
        })
        this.setLocation('/upload/rename')
      } else {
        throw new Error('No files selected')
      }
    })
  }

  upload() {
    // Track the start of uploads
    ReactGA.event({
      category: 'Upload',
      action: 'Started web upload',
      label: this.state.datasetId,
    })
    this.setState({
      uploading: true,
    })
    this.setLocation('/hidden')
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
        .catch(error => {
          Raven.captureException(error)
          toast.error(
            <span>
              <h3>Dataset creation failed</h3>
              <h4>Please check your connection</h4>
            </span>,
            { autoClose: false },
          )
          this.setState({
            error,
            uploading: false,
          })
          this.setLocation('/hidden')
        })
    }
  }

  /**
   * Replace Name in dataset_description and return a new file list
   * @param {string} Name - the new value for dataset Name field
   * @returns {File[]} - New list of files with a replaced dataset_description.json
   */
  _editName(Name) {
    if (!Name) {
      // Return files if no name provided
      return this.state.files
    }
    // Merge in the new name for a new dataset_description object
    const description = {
      ...this.state.description,
      Name,
    }
    // Don't mutate this.state.files
    const updatedFiles = [...this.state.files]
    const fileIndex = updatedFiles.findIndex(
      f => f.name === 'dataset_description.json',
    )
    // Hold onto webkitRelativePath for the new file
    const webkitRelativePath = updatedFiles[fileIndex].webkitRelativePath
    // Must be a Blob since File has immutable properties
    updatedFiles[fileIndex] = new Blob([JSON.stringify(description, null, 4)], {
      type: 'application/json',
    })
    updatedFiles[fileIndex].name = 'dataset_description.json'
    updatedFiles[fileIndex].webkitRelativePath = webkitRelativePath
    return updatedFiles
  }

  /**
   * Check for CHANGES file and add if it does not exist
   */
  _includeChanges(files) {
    // Determine if the files list has a CHANGES file already
    const hasChanges = files.some(f => f.name === 'CHANGES')

    // Do nothing if the file already exists
    if (hasChanges) return files

    // Construct the initial CHANGES file and add to the files array
    const snapshotText = 'Initial snapshot'
    const date = new Date().toISOString().split('T')[0]
    const versionString = '1.0.0'
    const initialChangesContent = `\n${versionString}\t${date}\n\n\t- ${snapshotText}`
    const initialChangesFile = new Blob([initialChangesContent], {
      type: 'text/plain',
    })
    initialChangesFile.name = 'CHANGES'
    initialChangesFile.webkitRelativePath = '/'
    files.push(initialChangesFile)
    return files
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
    // Uploads the version of files with dataset_description formatted and Name updated
    // Adds a CHANGES file if it is not present
    let filesToUpload = this._includeChanges(this._editName(this.state.name))

    return mutation
      .updateFiles(uploadClient)(this.state.datasetId, filesToUpload)
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
      })
      .catch(error => {
        Raven.captureException(error)
        const toastId = toast.error(
          <span>
            <h3>Dataset upload failed</h3>
            <h4>Please check your connection</h4>
            <FileSelect
              onChange={event => {
                toast.dismiss(toastId)
                this.resumeDataset(this.state.datasetId)(event)
              }}
              resume
            />
          </span>,
          { autoClose: false },
        )
        this.setState({
          error,
          uploading: false,
        })
        this.setLocation('/hidden')
        if (this.state.xhr) {
          try {
            this.state.xhr.abort()
          } catch (e) {
            Raven.captureException(e)
          }
        }
      })
  }

  uploadCompleteAction() {
    // Record upload finished successfully with Google Analytics
    ReactGA.event({
      category: 'Upload',
      action: 'Finished web upload',
      label: this.state.datasetId,
    })
    const datasetURL = `/datasets/${this.state.datasetId}`
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
