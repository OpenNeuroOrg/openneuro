// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Status from '../common/partials/status.jsx'
import UploadStore from '../upload/upload.store.js'
import { refluxConnect } from '../utils/reflux'

class Statuses extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, UploadStore, 'upload')
  }

  // life cycle events --------------------------------------------------

  render() {
    let dataset = this.props.dataset,
      minimal = this.props.minimal,
      status = dataset.status,
      uploading = dataset._id === this.state.upload.projectId,
      uploaderSubscribed = dataset.uploaderSubscribed

    return (
      <span className="status-wrap">
        <Status
          type="public"
          minimal={minimal}
          display={status.public || (status.hasPublic && minimal)}
        />
        <Status
          type="incomplete"
          minimal={minimal}
          display={status.incomplete && !uploading && minimal}
          dataset={dataset}
        />
        <Status type="shared" minimal={minimal} display={status.shared} />
        <Status type="inProgress" minimal={minimal} display={uploading} />
        <Status
          type="invalid"
          minimal={minimal}
          display={status.invalid && minimal}
        />
        <Status type="monitored" display={uploaderSubscribed} />
      </span>
    )
  }
}

Statuses.defaultProps = {
  minimal: false,
}

Statuses.propTypes = {
  dataset: PropTypes.object,
  minimal: PropTypes.bool,
}

export default Statuses
