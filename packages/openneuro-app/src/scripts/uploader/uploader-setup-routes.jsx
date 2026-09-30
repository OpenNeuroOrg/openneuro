import React from "react"
import PropTypes from "prop-types"
import { Route, Routes } from "react-router-dom"
import UploaderModal from "./uploader-modal.jsx"
import UploadStep from "./upload-step.jsx"
import UploadSelect from "./upload-select.jsx"
import UploadIssues from "./upload-issues"
import UploadMetadata from "./upload-metadata.jsx"
import UploadDisclaimer from "./upload-disclaimer.jsx"

const UploaderSetupRoutes = (props) => (
  <UploaderModal {...props}>
    <div className="grid">
      <div className="col col-6 col-md">
        <UploadStep location={props.location} />
        <div className="tasks-col fade-in">
          <div id="upload-tabs" className="uploader">
            <Routes location={props.location}>
              <Route path="/upload" element={<UploadSelect />} />
              <Route path="/upload/issues" element={<UploadIssues />} />
              <Route path="/upload/metadata" element={<UploadMetadata />} />
            </Routes>
          </div>
        </div>
      </div>
      <div className="col col-6 col-md">
        <UploadDisclaimer />
      </div>
    </div>
  </UploaderModal>
)

UploaderSetupRoutes.propTypes = {
  location: PropTypes.object,
  setLocation: PropTypes.func,
}

export default UploaderSetupRoutes
