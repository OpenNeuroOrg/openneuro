import React from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import BlockNavigation from '../common/partials/block-navigation.jsx'
import UploaderContext from './uploader-context.js'
import UploaderSetupRoutes from './uploader-setup-routes.jsx'
import UploaderStatusRoutes from './uploader-status-routes.jsx'
import UploadButton from './upload-button.jsx'
import UploadProgressButton from './upload-progress-button.jsx'
import { locationFactory } from './uploader-location.js'
import * as mutation from './upload-mutation.js'
import getClient from 'openneuro-client'
import config from '../../../config'
import getAuth from '../utils/getAuth.js'
import { xhrFetch } from './xhrfetch.js'

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
    this.selectFiles = this.selectFiles.bind(this)
    this.upload = this.upload.bind(this)
    this.uploadProgress = this.uploadProgress.bind(this)
    this.cancel = this.cancel.bind(this)

    this.state = {
      uploading: false, // An upload is processing
      location: locationFactory('/hidden'), // Which step in the modal
      files: {}, // List of files being uploaded
      name: '', // Relabel dataset during upload
      progress: 0,
      resume: null, // Resume an existing dataset
      setLocation: this.setLocation, // Allow context consumers to change routes
      setName: this.setName, // Rename on upload (optionally)
      selectFiles: this.selectFiles, // Get files from the browser
      upload: this.upload, // Start an upload
      xhr: null, // Upload XHR request
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
   * Select the files for upload
   * @param {object} event onChange event from multi file select
   */
  selectFiles({ files }) {
    if (files.length > 0) {
      this.setState({
        files,
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
    // This is an upload specific apollo client to record progress
    // Uses XHR since Fetch does not provide the required interface
    const uploadClient = getClient(`${config.url}/crn/graphql`, getAuth, xhrFetch(this))
    if (this.state.resume) {
      // Diff and add files
    } else {
      // Create dataset and then add files
      mutation
        .createDataset(this.props.client)(this.state.name)
        .then(datasetId =>
          mutation.updateFiles(uploadClient)(datasetId, this.state.files),
        )
        .then(() => {
          this.setState({ uploading: false })
        })
        .catch(err => {
          this.setState({ uploading: false })
          throw err
        })
    }
  }

  uploadProgress(e) {
    this.setState({
      progress: e.total > 0 ? Math.floor(e.loaded / e.total * 100) : 0,
    })
  }

  cancel() {
    this.state.xhr.abort()
    this.setState({ uploading: false, progress: 0 })
  }

  render() {
    if (this.state.uploading) {
      return (
        <UploaderContext.Provider value={this.state}>
          <UploadProgressButton />
          <UploaderStatusRoutes
            setLocation={this.setLocation}
            location={this.state.location}
            footer={
              <button className="btn-reset" onClick={this.cancel}>
                Cancel Upload
              </button>
            }
          />
          <BlockNavigation
            message={
              'An upload is in progress and will be interrupted, continue?'
            }
          />
        </UploaderContext.Provider>
      )
    } else {
      return (
        <UploaderContext.Provider value={this.state}>
          <UploadButton onClick={() => this.setLocation('/upload')} />
          <UploaderSetupRoutes
            setLocation={this.setLocation}
            location={this.state.location}
          />
        </UploaderContext.Provider>
      )
    }
  }
}

UploadClient.propTypes = {
  client: PropTypes.object,
}

const Uploader = () => (
  <ApolloConsumer>
    {client => (
      <div className="uploader">
        <UploadClient client={client} />
      </div>
    )}
  </ApolloConsumer>
)

export default Uploader
