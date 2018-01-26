// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Share from './share.jsx'
import Jobs from './jobs'
import Publish from './publish.jsx'
import FileDisplay from '../dataset.file-display.jsx'
import UpdateWarn from '../dataset.update-warning.jsx'
import datasetStore from '../dataset.store'
import datasetActions from '../dataset.actions.js'
import { refluxConnect } from '../../utils/reflux'

class ToolModals extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
  }

  // life cycle events --------------------------------------------------

  render() {
    let apps = this.state.datasets.apps,
      dataset = this.state.datasets.dataset,
      loadingApps = this.state.datasets.loadingApps,
      users = this.state.datasets.users,
      modals = this.state.datasets.modals,
      snapshots = this.state.datasets.snapshots

    return (
      <div>
        <Share
          dataset={dataset}
          users={users}
          show={modals.share}
          onHide={datasetActions.toggleModal.bind(null, 'share')}
        />
        <Jobs
          dataset={dataset}
          apps={apps}
          loadingApps={loadingApps}
          snapshots={snapshots}
          show={modals.jobs}
          onHide={datasetActions.dismissJobsModal}
        />
        <Publish
          dataset={dataset}
          snapshots={snapshots}
          show={modals.publish}
          onHide={datasetActions.toggleModal.bind(null, 'publish')}
        />
        <FileDisplay
          file={this.state.datasets.displayFile}
          show={modals.displayFile}
          onHide={datasetActions.toggleModal.bind(null, 'displayFile')}
        />
        <UpdateWarn
          show={this.state.datasets.modals.update}
          onHide={datasetActions.toggleModal.bind(null, 'update')}
          update={this.state.datasets.currentUpdate}
        />
      </div>
    )
  }
}

ToolModals.propTypes = {
  history: PropTypes.object,
}

export default ToolModals
