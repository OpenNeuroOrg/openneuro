// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import WarnButton from '../../common/forms/warn-button.jsx'
import userStore from '../../user/user.store.js'
import actions from '../dataset.actions.js'
import ToolModals from './modals.jsx'

class Tools extends React.Component {
  // life cycle events --------------------------------------------------

  componentDidMount() {
    let dataset = this.props.dataset
    if (dataset && (dataset.access === 'rw' || dataset.access == 'admin')) {
      actions.loadUsers()
    }
  }

  render() {
    let dataset = this.props.dataset,
      snapshots = this.props.snapshots

    let datasetHasJobs = !!this.props.dataset.jobs.length

    // permission check shorthands
    let isAdmin = dataset.access === 'admin',
      // isEditor     = dataset.access === 'rw',
      // isViewer     = dataset.access === 'ro',
      isSignedIn = !!userStore.hasToken(),
      isPublic = !!dataset.status.public,
      isIncomplete = !!dataset.status.incomplete,
      isInvalid = !!dataset.status.invalid,
      isSnapshot = !!dataset.original,
      isSubscribed = !!dataset.subscribed,
      isSuperuser =
        window.localStorage.scitran && JSON.parse(window.localStorage.scitran)
          ? JSON.parse(window.localStorage.scitran).root
          : null

    let displayDelete = this._deleteDataset(
      isAdmin,
      isPublic,
      isSuperuser,
      datasetHasJobs,
    )

    let tools = [
      {
        tooltip: 'Download Dataset',
        icon: 'fa-download',
        prepDownload: actions.getDatasetDownloadTicket,
        action: actions.toggleModal.bind(null, 'subscribe'),
        display: !isIncomplete,
        warn: false,
        modalLink: 'subscribe',
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Publish Dataset',
        icon: 'fa-globe icon-plus',
        action: actions.toggleModal.bind(null, 'publish'),
        display: isAdmin && !isPublic && !isIncomplete,
        warn: false,
        modalLink: 'publish',
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Unpublish Dataset',
        icon: 'fa-globe icon-ban',
        action: actions.publish.bind(this, dataset._id, false),
        display: isPublic && isSuperuser,
        warn: true,
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: isSnapshot ? 'Delete Snapshot' : 'Delete Dataset',
        icon: 'fa-trash',
        action: actions.deleteDataset.bind(
          this,
          dataset._id,
          this.props.history,
        ),
        display: displayDelete,
        warn: isSnapshot,
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Share Dataset',
        icon: 'fa-user icon-plus',
        action: actions.toggleModal.bind(null, 'share'),
        display: isAdmin && !isSnapshot && !isIncomplete,
        warn: true,
        modalLink: 'share',
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Create Snapshot',
        icon: 'fa-camera-retro icon-plus',
        action: actions.toggleModal.bind(null, 'snapshot'),
        display: isAdmin && !isSnapshot && !isIncomplete,
        warn: false,
        modalLink: 'snapshot',
        validations: [
          {
            check: isInvalid,
            message:
              'You cannot snapshot an invalid dataset. Please fix the errors and try again.',
            timeout: 5000,
            type: 'Error',
          },
          {
            check:
              snapshots.length > 1 &&
              moment(dataset.modified).diff(moment(snapshots[1].modified)) <= 0,
            message:
              'No modifications have been made since the last snapshot was created. Please use the most recent snapshot.',
            timeout: 6000,
            type: 'Error',
          },
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Run Analysis',
        icon: 'fa-area-chart icon-plus',
        action: actions.toggleModal.bind(null, 'jobs'),
        display: isSignedIn && !isIncomplete,
        warn: false,
        modalLink: 'jobs',
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Follow Dataset',
        icon: 'fa-tag icon-plus',
        action: actions.createSubscription.bind(this),
        display: isSignedIn && !isSubscribed,
        warn: true,
        validations: [
          {
            check: this.props.uploading && !isSnapshot,
            message: 'You are about to follow a dataset',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Unfollow Dataset',
        icon: 'fa-tag icon-minus',
        action: actions.deleteSubscription.bind(this),
        display: isSignedIn && isSubscribed,
        warn: true,
      },
    ]

    return (
      <div className="tools clearfix">
        {this._snapshotLabel(dataset)}
        {this._tools(tools)}
        <ToolModals />
      </div>
    )
  }

  // template methods ---------------------------------------------------

  _snapshotLabel(dataset) {
    return (
      <div className="snapshot-select-label">
        <div
          className={!dataset.original ? 'draft' : 'snapshot'}
          onClick={actions.toggleSidebar}>
          {!dataset.original
            ? 'Draft'
            : 'Snapshot v' + dataset.snapshot_version}
        </div>
      </div>
    )
  }

  _tools(toolConfig) {
    let tools = toolConfig.map((tool, index) => {
      if (tool.display) {
        return (
          <div role="presentation" className="tool" key={index}>
            <WarnButton
              tooltip={tool.tooltip}
              icon={tool.icon}
              prepDownload={tool.prepDownload}
              action={tool.action}
              warn={tool.warn}
              link={tool.link}
              modalLink={tool.modalLink}
              validations={tool.validations}
            />
          </div>
        )
      }
    })
    return tools
  }

  _deleteDataset(isAdmin, isPublic, isSuperuser, datasetHasJobs) {
    //CRN admin can delete any dataset
    if (isSuperuser) {
      return true
    }
    // If user is not a CRN admin and the dataset has jobs associated with it, don't allow deletion.
    if (datasetHasJobs) {
      return false
    }
    // If user is not a CRN admin, there are no jobs associated with dataset and the dataset is not public,
    // and the user has been given admin access (this is different than CRN admin) to the shared dataset
    // allow deletion
    if (isAdmin && !isPublic) {
      return true
    }
    //otherwise don't allow deletion
    return false
  }
}

Tools.propTypes = {
  dataset: PropTypes.object.isRequired,
  snapshots: PropTypes.array.isRequired,
  selectedSnapshot: PropTypes.string.isRequired,
  history: PropTypes.object,
  uploading: PropTypes.bool,
}

export default withRouter(Tools)
