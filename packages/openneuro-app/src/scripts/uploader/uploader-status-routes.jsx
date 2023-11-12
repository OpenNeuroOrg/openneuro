import React from "react"
import PropTypes from "prop-types"
import { Route, Routes } from "react-router-dom"
import UploaderModal from "./uploader-modal.jsx"
import UploadStatus from "./upload-status.jsx"

const UploaderStatusRoutes = (props) => (
  <UploaderModal {...props}>
    <div className="tasks-col fade-in">
      <div id="upload-tabs" className="uploader">
        <Routes location={props.location}>
          <Route path="/upload" element={<UploadStatus />} />
        </Routes>
      </div>
    </div>
  </UploaderModal>
)

UploaderStatusRoutes.propTypes = {
  location: PropTypes.object,
  setLocation: PropTypes.func,
  footer: PropTypes.element,
}

export default UploaderStatusRoutes
