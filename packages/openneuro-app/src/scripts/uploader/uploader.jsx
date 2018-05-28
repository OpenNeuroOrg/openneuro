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

    this.state = {
      uploading: false, // An upload is processing
      location: locationFactory('/hidden'), // Which step in the modal
      setLocation: this.setLocation, // Allow context consumers to change routes
    }
  }

  start() {
    this.setState({ location: locationFactory('/upload') })
  }

  setLocation(path) {
    this.setState({ location: locationFactory(path) })
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
