import React from 'react'
import BlockNavigation from '../../common/partials/block-navigation.jsx'
import UploaderContext from '../../uploader/uploader-context.js'
import UploaderSetupRoutes from '../../uploader/uploader-setup-routes.jsx'
import UploaderStatusRoutes from '../../uploader/uploader-status-routes.jsx'
import UploadButton from './upload-button.jsx'
import UploadProgressButton from './upload-progress-button.jsx'

const UploaderView = ({ uploader }) => {
  if (uploader.uploading) {
    return (
      <>
        <UploadProgressButton />
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
        <UploadButton onClick={() => uploader.setLocation('/upload')} />
        <UploaderSetupRoutes
          setLocation={uploader.setLocation}
          location={uploader.location}
        />
      </>
    )
  }
}

const UploaderViewContainer = () => (
  <UploaderContext.Consumer>
    {uploader => <UploaderView uploader={uploader} />}
  </UploaderContext.Consumer>
)

export default UploaderViewContainer
