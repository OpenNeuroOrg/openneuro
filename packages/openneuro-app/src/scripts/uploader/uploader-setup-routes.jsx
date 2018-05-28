import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UploaderModal from './uploader-modal.jsx'
import UploadSelect from './upload-select.jsx'
import UploadRename from './upload-rename.jsx'
import UploadIssues from './upload-issues.jsx'
import UploadDisclaimer from './upload-disclaimer.jsx'

const SetupModal = ({ location }) => (
  <UploaderModal>
    <Switch location={location}>
      <Route
        name="upload-select"
        path="/upload"
        exact
        component={UploadSelect}
      />
      <Route
        name="upload-rename"
        path="/upload/rename"
        exact
        component={UploadRename}
      />
      <Route
        name="upload-issues"
        path="/upload/issues"
        exact
        component={UploadIssues}
      />
      <Route
        name="upload-disclaimer"
        path="/upload/disclaimer"
        exact
        component={UploadDisclaimer}
      />
    </Switch>
  </UploaderModal>
)

const UploaderSetupRoutes = ({ location }) => (
  <Switch location={location}>
    <Route name="upload-hidden" path="/hidden" exact component={() => null} />
    <Route
      name="upload-modal"
      path="/upload"
      component={() => <SetupModal location={location} />}
    />
  </Switch>
)

export default UploaderSetupRoutes
