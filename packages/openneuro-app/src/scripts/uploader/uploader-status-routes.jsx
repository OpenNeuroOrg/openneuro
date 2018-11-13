import React from 'react'
import PropTypes from 'prop-types'
import analyticsWrapper from '../utils/analytics.js'
import { Route, Switch } from 'react-router-dom'
import UploaderModal from './uploader-modal.jsx'
import UploadStatus from './upload-status.jsx'

const UploaderStatusRoutes = props => (
  <UploaderModal {...props}>
    <div className="tasks-col fade-in">
      <div id="upload-tabs" className="uploader container">
        <Switch location={props.location}>
          <Route
            name="upload-status"
            path="/upload"
            exact
            component={analyticsWrapper(UploadStatus)}
          />
        </Switch>
      </div>
    </div>
  </UploaderModal>
)

UploaderStatusRoutes.propTypes = {
  location: PropTypes.object,
}

export default UploaderStatusRoutes
