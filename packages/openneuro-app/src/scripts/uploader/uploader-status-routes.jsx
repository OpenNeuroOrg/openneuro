import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import UploaderModal from './uploader-modal.jsx'
import UploadStatus from './upload-status.jsx'

const StatusModal = ({ location }) => (
  <UploaderModal>
    <Switch location={location}>
      <Route
        name="upload-status"
        path="/upload"
        exact
        component={UploadStatus}
      />
    </Switch>
  </UploaderModal>
)

StatusModal.propTypes = {
  location: PropTypes.object,
}

const UploaderStatusRoutes = ({ location }) => (
  <Switch location={location}>
    <Route name="upload-hidden" path="/hidden" exact component={() => null} />
    <Route
      name="upload-modal"
      path="/upload"
      component={() => <StatusModal location={location} />}
    />
  </Switch>
)

UploaderStatusRoutes.propTypes = {
  location: PropTypes.object,
}

export default UploaderStatusRoutes
