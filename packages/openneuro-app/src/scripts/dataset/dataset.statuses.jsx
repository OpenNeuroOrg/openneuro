// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Status from '../common/partials/status.jsx'
import withProfile from '../authentication/withProfile'

class Statuses extends React.Component {
  constructor() {
    super()
  }

  // life cycle events --------------------------------------------------

  render() {
    const uploading = false
    const dataset = this.props.dataset
    const minimal = this.props.minimal
    const profile = this.props.profile
    const uploaderSubscribed = dataset.followers.some(
      follower => follower.userId === dataset.uploader.id,
    )
    const invalid = dataset.draft.issues.some(
      issue => issue.severity === 'error',
    )
    const shared = dataset.uploader.id !== profile.sub

    return (
      <span className="status-wrap">
        <Status type="public" minimal={minimal} display={dataset.public} />
        <Status
          type="incomplete"
          minimal={minimal}
          display={dataset.draft.partial && !uploading && minimal}
          dataset={dataset}
        />
        <Status type="shared" minimal={minimal} display={shared} />
        <Status type="inProgress" minimal={minimal} display={uploading} />
        <Status type="invalid" minimal={minimal} display={invalid && minimal} />
        <Status type="monitored" display={uploaderSubscribed && !minimal} />
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

export default withProfile(Statuses)
