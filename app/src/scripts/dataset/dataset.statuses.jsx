// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Status from '../common/partials/status.jsx'
import UploadStore from '../upload/upload.store.js'

let Statuses = React.createClass({
  mixins: [Reflux.connect(UploadStore, 'upload')],

  // life cycle events --------------------------------------------------

  getDefaultProps() {
    return {
      minimal: false,
    }
  },

  propTypes: {
    dataset: PropTypes.object,
    minimal: PropTypes.bool,
  },

  render() {
    let dataset = this.props.dataset,
      minimal = this.props.minimal,
      status = dataset.status,
      uploading = dataset._id === this.state.upload.projectId

    return (
      <span className="clearfix status-wrap">
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
      </span>
    )
  },
})

export default Statuses
