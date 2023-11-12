import React from "react"
import BlockNavigation from "../common/partials/block-navigation.jsx"
import UploaderSetupRoutes from "./uploader-setup-routes.jsx"
import UploaderStatusRoutes from "./uploader-status-routes.jsx"

const UploaderView = ({ uploader }) => {
  if (uploader.uploading) {
    return (
      <>
        <UploaderStatusRoutes
          setLocation={uploader.setLocation}
          location={uploader.location}
          footer={
            <button className="btn-reset" onClick={uploader.cancel}>
              Cancel Upload
            </button>
          }
        />
        <BlockNavigation message="An upload is in progress and will be interrupted, continue?" />
      </>
    )
  } else {
    return (
      <>
        <UploaderSetupRoutes
          setLocation={uploader.setLocation}
          location={uploader.location}
        />
      </>
    )
  }
}

export default UploaderView
