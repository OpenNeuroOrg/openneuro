import React from 'react'
import UploaderContext from './uploader-context.js'
import UploaderSetupRoutes from './uploader-setup-routes.jsx'
import UploaderStatusRoutes from './uploader-status-routes.jsx'
import UploadButton from './upload-button.jsx'
import UploadProgressButton from './upload-button-progress.jsx'
import { locationFactory } from './uploader-location.js'

/**
 * Stateful uploader workflow and status
 *
 * Usable from anywhere, so this button sets up a modal and
 * virtual router to navigate within it.
 */
class Uploader extends React.Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.setName = this.setName.bind(this)
    this.selectFiles = this.selectFiles.bind(this)
    this.validate = this.validate.bind(this)
    this.disclaimer = this.disclaimer.bind(this)
    this.upload = this.upload.bind(this)

    this.state = {
      uploading: false, // An upload is processing
      location: locationFactory('/hidden'), // Which step in the modal
      tree: {},
      list: [],
      name: '',
      setLocation: this.setLocation, // Allow context consumers to change routes
      setName: this.setName, // Rename on upload (optionally)
      selectFiles: this.selectFiles, // Get files from the browser
      validate: this.validate, // Continue to validate step
      disclaimer: this.disclaimer, // Continue to disclaimer
      upload: this.upload, // Start an upload
    }
  }

  start() {
    this.setState({ location: locationFactory('/upload') })
  }

  setLocation(path) {
    this.setState({ location: locationFactory(path) })
  }

  setName(name) {
    this.setState({ name })
  }

  /**
   * Select the files for upload
   * @param {object} event onChange event from multi file select
   */
  selectFiles({ tree, list }) {
    if (list.length > 0) {
      this.setState({
        tree,
        list,
        location: locationFactory('/upload/rename'),
        name: tree[0].name,
      })
    } else {
      throw new Error('No files selected')
    }
  }

  validate() {
    this.setState({ location: locationFactory('/upload/issues') })
  }

  disclaimer() {
    this.setState({ location: locationFactory('/upload/disclaimer') })
  }

  upload() {
    this.setState({ uploading: true, location: locationFactory('/upload') })
  }

  render() {
    if (this.state.uploading) {
      return (
        <UploaderContext.Provider value={this.state}>
          <UploadProgressButton />
          <UploaderStatusRoutes location={this.state.location} />
        </UploaderContext.Provider>
      )
    } else {
      return (
        <UploaderContext.Provider value={this.state}>
          <UploadButton onClick={this.start} />
          <UploaderSetupRoutes location={this.state.location} />
        </UploaderContext.Provider>
      )
    }
  }
}

export default Uploader
