import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import UploaderModal from './uploader-modal.jsx'
import UploadStatus from './upload-status.jsx'

const UploaderStatusRoutes = props => (
  <UploaderModal {...props}>
    <Switch location={props.location}>
      <Route
        name="upload-status"
        path="/upload"
        exact
        component={UploadStatus}
      />
    </Switch>
  </UploaderModal>
)

UploaderStatusRoutes.propTypes = {
  location: PropTypes.object,
}

export default UploaderStatusRoutes
