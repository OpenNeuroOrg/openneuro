// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import WarnButton from '../../../common/forms/warn-button.jsx'
import actions from '../../../dataset/dataset.actions.js'
import datasetStore from '../../../dataset/dataset.store.js'
import { refluxConnect } from '../../../utils/reflux'
import { getProfile } from '../../../authentication/profile.js'

class Tools extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
  }

  // life cycle events --------------------------------------------------

  componentDidMount() {
    // let dataset = this.state.datasets.dataset
    // if (dataset && (dataset.access === 'rw' || dataset.access == 'admin')) {
    //   actions.loadUsers()
    // }
  }

  render() {
    let dataset = this.props.dataset
    let datasets = this.state.datasets
    let datasetUrl = '/datasets/' + dataset.id

    // let dataset = datasets ? datasets.dataset : null,
    if (!dataset) {
      return null
    }

    const userProfile = getProfile()
    // let datasetHasJobs = !!dataset.jobs.length
    // // permission check shorthands
    // let isAdmin = dataset.access === 'admin',
    let isAdmin = userProfile.superuser,
      isSignedIn = userProfile !== null,
      isPublic = !!dataset.public,
      isIncomplete = !!(dataset.status && dataset.status.incomplete),
      //   isInvalid = !!dataset.status.invalid,
      isSnapshot = !!(this.props.location.pathname.indexOf('versions') == -1),
      isSubscribed = !!dataset.subscribed
    //   hasUserStar = !!dataset.hasUserStar,
    //   hasDoi =
    //     dataset.description.DatasetDOI &&
    //     dataset.description.DatasetDOI.toLowerCase().indexOf('openneuro') >= 0,
    //   isSuperuser =
    //     window.localStorage.scitran && JSON.parse(window.localStorage.scitran)
    //       ? JSON.parse(window.localStorage.scitran).root
    //       : null

    // let displayDelete = this._deleteDataset(
    //   isAdmin,
    //   isPublic,
    //   isSuperuser,
    //   datasetHasJobs,
    // )

    let tools = [
      {
        tooltip: 'Download Dataset',
        icon: 'fa-download',
        prepDownload: actions.getDatasetDownloadTicket.bind(this),
        action: actions.confirmDatasetDownload.bind(this, this.props.history),
        display: !isIncomplete,
        warn: true,
        modalLink: datasetUrl + '/subscribe',
        validations: [
          {
            check: datasets.uploading && !isSnapshot,
            message: 'Files are currently uploading',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      {
        tooltip: 'Publish Dataset',
        icon: 'fa-globe icon-plus',
        action: actions.showDatasetComponent.bind(
          this,
          'publish',
          this.props.history,
        ),
        display: isAdmin && !isPublic,
        // && !isIncomplete,
        warn: false,
        modalLink: datasetUrl + '/publish',
        // validations: [
        //   {
        //     check: datasets.uploading && !isSnapshot,
        //     message: 'Files are currently uploading',
        //     timeout: 5000,
        //     type: 'Error',
        //   },
        // ],
      },
      //   {
      //     tooltip: 'Unpublish Dataset',
      //     icon: 'fa-globe icon-ban',
      //     action: actions.publish.bind(
      //       this,
      //       dataset._id,
      //       false,
      //       this.props.history,
      //     ),
      //     display: isPublic && isSuperuser,
      //     warn: true,
      //     validations: [
      //       {
      //         check: datasets.uploading && !isSnapshot,
      //         message: 'Files are currently uploading',
      //         timeout: 5000,
      //         type: 'Error',
      //       },
      //     ],
      //   },
      //   {
      //     tooltip: isSnapshot ? 'Delete Snapshot' : 'Delete Dataset',
      //     icon: 'fa-trash',
      //     action: actions.deleteDataset.bind(
      //       this,
      //       dataset._id,
      //       this.props.history,
      //     ),
      //     display: displayDelete,
      //     warn: true,
      //     validations: [
      //       {
      //         check: datasets.uploading && !isSnapshot,
      //         message: 'Files are currently uploading',
      //         timeout: 5000,
      //         type: 'Error',
      //       },
      //     ],
      //   },
      //   {
      //     tooltip: 'Share Dataset',
      //     icon: 'fa-user icon-plus',
      //     action: actions.showDatasetComponent.bind(
      //       this,
      //       'share',
      //       this.props.history,
      //     ),
      //     display: isAdmin && !isSnapshot && !isIncomplete,
      //     warn: false,
      //     modalLink: datasetUrl + '/share',
      //     validations: [
      //       {
      //         check: datasets.uploading && !isSnapshot,
      //         message: 'Files are currently uploading',
      //         timeout: 5000,
      //         type: 'Error',
      //       },
      //     ],
      //   },
      //   {
      //     tooltip: 'Create Snapshot',
      //     icon: 'fa-camera-retro icon-plus',
      //     action: actions.showDatasetComponent.bind(
      //       this,
      //       'create-snapshot',
      //       this.props.history,
      //     ),
      //     display: isAdmin && !isSnapshot && !isIncomplete,
      //     warn: false,
      //     modalLink: datasetUrl + '/create-snapshot',
      //     validations: [
      //       {
      //         check: isInvalid,
      //         message:
      //           'You cannot snapshot an invalid dataset. Please fix the errors and try again.',
      //         timeout: 5000,
      //         type: 'Error',
      //       },
      //       {
      //         check:
      //           snapshots.length > 1 &&
      //           moment(dataset.modified).diff(moment(snapshots[1].modified)) <= 0,
      //         message:
      //           'No modifications have been made since the last snapshot was created. Please use the most recent snapshot.',
      //         timeout: 6000,
      //         type: 'Error',
      //       },
      //       {
      //         check: datasets.uploading && !isSnapshot,
      //         message: 'Files are currently uploading',
      //         timeout: 5000,
      //         type: 'Error',
      //       },
      //     ],
      //   },
      //   {
      //     tooltip: 'Run Analysis',
      //     icon: 'fa-area-chart icon-plus',
      //     action: actions.showDatasetComponent.bind(
      //       this,
      //       'jobs',
      //       this.props.history,
      //     ),
      //     display: isSignedIn && !isIncomplete,
      //     warn: false,
      //     modalLink: datasetUrl + '/jobs',
      //     validations: [
      //       {
      //         check: datasets.uploading && !isSnapshot,
      //         message: 'Files are currently uploading',
      //         timeout: 5000,
      //         type: 'Error',
      //       },
      //     ],
      //   },
      {
        tooltip: 'Follow Dataset',
        icon: 'fa-tag icon-plus',
        action: actions.createSubscription.bind(this),
        display: isSignedIn && !isSubscribed,
        warn: false,
        validations: [
          {
            check: datasets.uploading && !isSnapshot,
            message: 'You are about to follow a dataset',
            timeout: 5000,
            type: 'Error',
          },
        ],
      },
      //   {
      //     tooltip: 'Unfollow Dataset',
      //     icon: 'fa-tag icon-minus',
      //     action: actions.deleteSubscription.bind(this),
      //     display: isSignedIn && isSubscribed,
      //     warn: true,
      //   },
      //   {
      //     tooltip: 'Star Dataset',
      //     icon: 'fa-star icon-plus',
      //     action: actions.addStar.bind(this),
      //     display: isSignedIn && !hasUserStar,
      //     warn: false,
      //   },
      //   {
      //     tooltip: 'Unstar Dataset',
      //     icon: 'fa-star-o icon-minus',
      //     action: actions.removeStar.bind(this),
      //     display: isSignedIn && hasUserStar,
      //     warn: true,
      //   },
      //   {
      //     tooltip: 'Generate DOI',
      //     icon: 'fa-gavel icon-plus',
      //     action: actions.registerDoi.bind(this),
      //     display: isAdmin && isPublic && !hasDoi,
      //     warn: true,
      //   },
    ]

    if (dataset && !dataset.loading) {
      return (
        <div className="col-xs-12 dataset-tools-wrap">
          <div className="tools clearfix">
            {this._snapshotLabel(dataset)}
            {this._tools(tools)}
          </div>
        </div>
      )
    } else {
      return null
    }
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
  history: PropTypes.object,
  location: PropTypes.object,
}

export default withRouter(Tools)
