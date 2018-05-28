import React from 'react'
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

export default UploaderStatusRoutes
