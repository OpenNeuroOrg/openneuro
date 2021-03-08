import * as Sentry from '@sentry/browser'
import { toast } from 'react-toastify'
import ToastContent from '../common/partials/toast-content.jsx'
import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from '@apollo/client'
import * as ReactGA from 'react-ga'
import UploaderContext from './uploader-context.js'
import FileSelect from '../common/forms/file-select.jsx'
import { locationFactory } from './uploader-location.js'
import * as mutation from './upload-mutation.js'
import { datasets, uploads } from 'openneuro-client'
import { withRouter } from 'react-router-dom'
import { uploadFiles } from './file-upload.js'
import { UploadProgress } from './upload-progress.js'
import { addPathToFiles } from './add-path-to-files.js'

/**
 * Stateful uploader workflow and status
 *
 * Usable from anywhere, so this button sets up a modal and
 * virtual router to navigate within it.
 */
export class UploadClient extends React.Component {
  constructor(props) {
    super(props)

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
      // Control if the top level path is trimmed out (good for initial uploads, bad for adding to dataset)
      stripRelativePath: true,
      // Allow context consumers to change routes
      setLocation: this.setLocation,
      // Set a dataset to resume upload for
      resumeDataset: this.resumeDataset,
      // Get files from the browser
      selectFiles: this.selectFiles,
      // Capture metadata from form
      captureMetadata: this.captureMetadata,
      // Start an upload
      upload: this.upload,
      // Upload XHR request
      xhr: null,
      // Id of the uploaded dataset
      datasetId: null,
      // Cancel current upload
      cancel: this.cancel,
      // dataset metadata
      metadata: {},
      // Track currently uploading files
      uploadingFiles: new Set(),
      // Track any failed files
      failedFiles: new Set(),
      // Abort controller for abandoning the upload
      abortController: null,
    }
  }

  /**
   * Change to a new step in upload setup
   *
   * @param {string} path Virtual router path for upload modal
   */
  setLocation = path => {
    ReactGA.pageview(path)
    this.setState({ location: locationFactory(path) })
  }

  /**
   * Specify a dataset to resume upload for
   * @param {string} datasetId
   * @param {string} path Optional path to prefix all files with
   * @param {boolean} stripRelativePath Don't strip the first path (useful for adding directories)
   */
  resumeDataset = (datasetId, path, stripRelativePath) => {
    return ({ files }) => {
      this.props.client
        .query({
          query: datasets.getDraftFiles,
          variables: { id: datasetId },
        })
        .then(
          ({
            data: {
              dataset: {
                draft,
                metadata: { affirmedDefaced, affirmedConsent },
              },
            },
          }) => {
            // Create a new array of files to upload
            const filesToUpload = []
            // Create hashmap of filename -> size
            const existingFiles = draft.files.reduce((existingFiles, f) => {
              existingFiles[f.filename] = f.size
              return existingFiles
            }, {})
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
              stripRelativePath,
              files: addPathToFiles(filesToUpload, path),
              selectedFiles: files,
            })
            this.upload({ affirmedDefaced, affirmedConsent })
          },
        )
    }
  }

  /**
   * Select the files for upload
   * @param {object} event onChange event from multi file select
   */
  selectFiles = ({ files }) => {
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
        this.setLocation('/upload/issues')
      } else {
        throw new Error('No files selected')
      }
    })
  }

  captureMetadata = metadata => {
    this.setState({
      metadata,
    })
  }

  uploadMetadata = () =>
    mutation.submitMetadata(this.props.client)(
      this.state.datasetId,
      this.state.metadata,
    )

  upload = ({ affirmedDefaced, affirmedConsent }) => {
    // Track the start of uploads
    ReactGA.event({
      category: 'Upload',
      action: 'Started web upload',
      label: this.state.datasetId,
    })
    this.setState({
      uploading: true,
      abortController: new AbortController(),
    })
    this.setLocation('/hidden')
    if (this.state.resume && this.state.datasetId) {
      // Just add files since this is an existing dataset
      this._addFiles()
    } else {
      // Create dataset and then add files
      mutation
        .createDataset(this.props.client)({
          affirmedDefaced,
          affirmedConsent,
        })
        .then(datasetId => {
          // Note chain to this._addFiles
          this.setState({ datasetId }, () => {
            this.uploadMetadata()
            this._addFiles()
          })
        })
        .catch(error => {
          Sentry.captureException(error)
          toast.error(
            <ToastContent
              title="Dataset creation failed"
              body="Please check your connection"
            />,
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
   * Check for CHANGES file and add if it does not exist
   */
  _includeChanges() {
    const files = [...this.state.files]
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
    initialChangesFile.webkitRelativePath = '/CHANGES'
    files.push(initialChangesFile)
    return files
  }

  /**
   * Do the actual upload
   */
  async _addFiles() {
    // Uploads the version of files with dataset_description formatted and Name updated
    // Adds a CHANGES file if it is not present
    const filesToUpload = this.state.resume
      ? this.state.files
      : this._includeChanges()

    // Call prepare upload to find the bucket needed and endpoint
    const {
      data: {
        prepareUpload: { id: uploadId, endpoint, token },
      },
    } = await mutation.prepareUpload(this.props.client)({
      datasetId: this.state.datasetId,
      uploadId: uploads.hashFileList(this.state.datasetId, filesToUpload),
    })

    try {
      await uploadFiles({
        uploadId,
        datasetId: this.state.datasetId,
        endpoint,
        filesToUpload,
        token,
        uploadProgress: new UploadProgress(
          this.uploadProgress,
          filesToUpload.length,
        ),
        abortController: this.state.abortController,
        stripRelativePath: this.state.stripRelativePath,
      })
      if (!this.state.abortController.signal.aborted) {
        await mutation.finishUpload(this.props.client)(uploadId)
        this.setState({ uploading: false })
        this.uploadCompleteAction()
      }
    } catch (error) {
      Sentry.captureException(error)
      const toastId = toast.error(
        <ToastContent
          title="Dataset upload failed"
          body="Please check your connection">
          <FileSelect
            onChange={event => {
              toast.dismiss(toastId)
              this.resumeDataset(this.state.datasetId)(event)
            }}
            resume
          />
        </ToastContent>,
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
          Sentry.captureException(e)
        }
      }
    }
  }

  uploadCompleteAction = () => {
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
      toast.success(
        <ToastContent
          title="Upload complete"
          body="Dataset successfully uploaded">
          <a href={datasetURL}>Click here to browse your dataset.</a>
        </ToastContent>,
        { autoClose: false },
      )
    }
  }

  uploadProgress = state => {
    this.setState(state)
  }

  cancel = () => {
    this.state.abortController.abort()
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
