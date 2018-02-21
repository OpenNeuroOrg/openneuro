// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import { withRouter } from 'react-router-dom'
import Share from './share.jsx'
import Jobs from './jobs'
import Publish from './publish.jsx'
import Snapshot from './snapshot.jsx'
import FileDisplay from '../dataset.file-display.jsx'
import FileEdit from '../dataset.file-edit.jsx'
import Subscribe from './subscribe.jsx'
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
  componentWillReceiveProps() {
    const query = new URLSearchParams(this.props.history.location.search)
    let modal = query.get('modal')
    let modals = this.state.datasets.modals

    if (modal) {
      if (!modals[modal]) {
        datasetActions.toggleModal(modal)
      }
    } else {
      let values = Object.values(modals)
      if (
        values.some(item => {
          return item
        })
      )
        datasetActions.dismissModals()
    }
  }

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
          isSnapshot={this.state.datasets.snapshot}
          onHide={datasetActions.toggleModal.bind(null, 'displayFile')}
          onSave={datasetActions.updateFile}
        />
        <FileEdit
          file={this.state.datasets.editFile}
          show={modals.editFile}
          isSnapshot={this.state.datasets.snapshot}
          onHide={datasetActions.toggleModal.bind(null, 'editFile')}
          onSave={datasetActions.updateFile}
        />
        <UpdateWarn
          show={this.state.datasets.modals.update}
          onHide={datasetActions.toggleModal.bind(null, 'update')}
          update={this.state.datasets.currentUpdate}
        />
        <Subscribe
          show={this.state.datasets.modals.subscribe}
          onHide={datasetActions.toggleModal.bind(null, 'subscribe')}
          subscribed={this.state.datasets.dataset.subscribed}
          createSubscription={datasetActions.createSubscription}
        />
      </div>
    )
  }
}

ToolModals.propTypes = {
  history: PropTypes.object,
}

export default withRouter(ToolModals)
