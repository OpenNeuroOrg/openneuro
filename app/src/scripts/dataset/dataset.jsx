// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import Spinner from '../common/partials/spinner.jsx'
import datasetStore from './dataset.store'
import actions from './dataset.actions.js'
import MetaData from './dataset.metadata.jsx'
import Tools from './tools'
import Statuses from './dataset.statuses.jsx'
import Validation from './dataset.validation.jsx'
import ClickToEdit from '../common/forms/click-to-edit.jsx'
import FileTree from '../common/partials/file-tree.jsx'
import Jobs from './dataset.jobs.jsx'
import userStore from '../user/user.store.js'
import Summary from './dataset.summary.jsx'
import FileSelect from '../common/forms/file-select.jsx'
import uploadActions from '../upload/upload.actions.js'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'

class Dataset extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
  }
  // life cycle events --------------------------------------------------

  componentWillReceiveProps(nextProps) {
    this._loadData(
      nextProps.match.params.datasetId,
      nextProps.match.params.snapshotId,
    )
  }

  componentDidMount() {
    const datasetId = this.props.match.params.datasetId
    const snapshotId = this.props.match.params.snapshotId
    this._loadData(datasetId, snapshotId)
    this.props.history.block(() => {
      if (this.state.datasets.uploading) {
        return 'You are currently uploading files. Leaving this page will cancel the upload process.'
      }
    })
  }

  _loadData(datasetId, snapshotId) {
    const query = new URLSearchParams(this.props.location.search)
    if (snapshotId) {
      const app = query.get('app')
      const version = query.get('version')
      const job = query.get('job')
      const snapshotUrl = bids.encodeId(datasetId, snapshotId)
      actions.trackView(snapshotUrl)
      actions.loadDataset(snapshotUrl, {
        snapshot: true,
        app: app,
        version: version,
        job: job,
      })
    } else if (
      (datasetId && !this.state.datasets.dataset) ||
      (datasetId && datasetId !== this.state.datasets.dataset._id)
    ) {
      actions.loadDataset(bids.encodeId(datasetId))
    }
  }

  componentWillUnmount() {
    actions.setInitialState({ apps: this.state.datasets.apps })
    super.componentWillUnmount()
    document.title = 'OpenNeuro'
  }

  render() {
    let dataset = this.state.datasets.dataset
    let snapshots = this.state.datasets.snapshots
    let showSidebar = this.state.datasets.showSidebar
    let canEdit =
      dataset &&
      (dataset.access === 'rw' || dataset.access == 'admin') &&
      !dataset.original
    let loadingText =
      typeof this.state.datasets.loading == 'string'
        ? this.state.datasets.loading
        : 'loading'
    let content

    if (dataset) {
      document.title = 'OpenNeuro - ' + dataset.label
      let errors = dataset.validation.errors
      let warnings = dataset.validation.warnings
      content = (
        <div className="clearfix dataset-wrap">
          <div className="dataset-annimation">
            <div className="col-xs-12 dataset-inner">
              <div className="row">
                <div className="col-xs-6">
                  <h1 className="clearfix">
                    <ClickToEdit
                      value={dataset.label}
                      label={dataset.label}
                      editable={canEdit}
                      onChange={actions.updateName}
                      type="string"
                    />
                  </h1>
                  {this._uploaded(dataset)}
                  {this._modified(dataset.modified)}
                  {this._authors(dataset.authors)}
                  {this._views(dataset.views)}
                  {this._downloads(dataset.downloads)}
                  <Summary summary={dataset.summary} />
                  <div className="status-container">
                    <Statuses dataset={dataset} />
                  </div>
                  <MetaData
                    dataset={dataset}
                    editable={canEdit}
                    issues={this.state.datasets.metadataIssues}
                  />
                </div>
                <div className="col-xs-6">
                  <div>
                    <Validation
                      errors={errors}
                      warnings={warnings}
                      validating={dataset.status.validating}
                      display={!dataset.status.incomplete}
                    />
                    <div className="fade-in col-xs-12">
                      <Jobs />
                    </div>
                    <div className="dataset-files">
                      {this._incompleteMessage(dataset)}
                      {this._fileTree(dataset, canEdit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      let message
      let status = this.state.datasets.status
      if (status === 404) {
        message = 'Dataset not found'
      }
      if (status === 403) {
        message = 'You are not authorized to view this dataset'
      }
      content = (
        <div className="page dataset">
          <div className="dataset-container">
            <h2 className="message-4">{message}</h2>
          </div>
        </div>
      )
    }

    return (
      <div className="page dataset">
        <div
          className={
            showSidebar ? 'open dataset-container' : 'dataset-container'
          }>
          {this._leftSidebar(snapshots)}
          {this._showSideBarButton()}
          {!this.state.datasets.loading ? this._tools(dataset) : null}
          <div className="fade-in inner-route dataset-route light">
            {this.state.datasets.loading ? (
              <Spinner active={true} text={loadingText} />
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    )
  }

  // template methods ---------------------------------------------------

  _tools(dataset) {
    if (dataset) {
      return (
        <div className="col-xs-12 dataset-tools-wrap">
          <Tools
            dataset={dataset}
            selectedSnapshot={this.state.datasets.selectedSnapshot}
            snapshots={this.state.datasets.snapshots}
          />
        </div>
      )
    }
  }

  _leftSidebar(snapshots) {
    let isSignedIn = !!userStore.hasToken()
    let snapshotOptions = snapshots.map(snapshot => {
      if (snapshot.orphaned) {
        return (
          <li key="orphaned">
            <a disabled>
              <div className="clearfix">
                <div className=" col-xs-12">
                  <span className="dataset-type text-danger">
                    Draft dataset has been deleted.
                  </span>
                  <span className="icons text-danger">
                    <span className="published">
                      <i className="fa fa-exclamation-circle" />
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </li>
        )
      }

      let analysisCount
      if (!snapshot.isOriginal && snapshot.analysisCount > 0) {
        analysisCount = (
          <span className="job-count">
            <i className="fa fa-area-chart" />
            <span className="count">{snapshot.analysisCount}</span>
          </span>
        )
      }

      const datasetId = bids.decodeId(
        snapshot.original ? snapshot.original : snapshot._id,
      )
      const urlBase = '/datasets/' + datasetId
      const snapshotUrl = snapshot.original
        ? urlBase + '/versions/' + bids.decodeId(snapshot._id)
        : urlBase

      return (
        <li key={snapshot._id}>
          <Link
            to={snapshotUrl}
            className={
              this.state.datasets.selectedSnapshot == snapshot._id
                ? 'active'
                : null
            }>
            <div className="clearfix">
              <div className=" col-xs-12">
                <span className="dataset-type">
                  {snapshot.isOriginal
                    ? 'Draft'
                    : 'v' + snapshot.snapshot_version}
                </span>
                <span className="date-modified">
                  {snapshot.modified
                    ? moment(snapshot.modified).format('ll')
                    : null}
                </span>
                <span className="icons">
                  {snapshot.public && isSignedIn ? (
                    <span className="published">
                      <i className="fa fa-globe" />
                    </span>
                  ) : null}
                  {analysisCount}
                </span>
              </div>
            </div>
          </Link>
        </li>
      )
    })

    return (
      <div className="left-sidebar">
        <span className="slide">
          <div role="presentation" className="snapshot-select">
            <span>
              <h3>Versions</h3>
              <ul>{snapshotOptions}</ul>
            </span>
          </div>
        </span>
      </div>
    )
  }

  _showSideBarButton() {
    let showSidebar = this.state.datasets.showSidebar
    return (
      <span className="show-nav-btn" onClick={actions.toggleSidebar}>
        {showSidebar ? (
          <i className="fa fa-angle-double-left" aria-hidden="true" />
        ) : (
          <i className="fa fa-angle-double-right" aria-hidden="true" />
        )}
      </span>
    )
  }

  _authors(authors) {
    if (authors.length > 0) {
      let authorString = 'authored by '
      for (let i = 0; i < authors.length; i++) {
        let author = authors[i]
        authorString += author.name
        if (authors.length > 1) {
          if (i < authors.length - 2) {
            authorString += ', '
          } else if (i == authors.length - 2) {
            authorString += ' and '
          }
        }
      }
      return <h6>{authorString}</h6>
    }
  }

  _downloads(downloads) {
    if (downloads) {
      return <h6>downloads: {downloads}</h6>
    }
  }

  _fileTree(dataset, canEdit) {
    if (!dataset.status.incomplete) {
      return (
        <div className="col-xs-12">
          <div className="file-structure fade-in panel-group">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Dataset File Tree</h3>
              </div>
              <div className="panel-collapse" aria-expanded="false">
                <div className="panel-body">
                  <FileTree
                    tree={[dataset]}
                    editable={canEdit}
                    loading={this.state.datasets.loadingTree}
                    dismissError={actions.dismissError}
                    deleteFile={actions.deleteFile}
                    getFileDownloadTicket={actions.getFileDownloadTicket}
                    displayFile={actions.displayFile.bind(this, null, null)}
                    toggleFolder={actions.toggleFolder}
                    addFile={actions.addFile}
                    addDirectoryFile={actions.addDirectoryFile}
                    deleteDirectory={actions.deleteDirectory}
                    updateFile={actions.updateFile}
                    topLevel
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  _incompleteMessage(dataset) {
    if (
      dataset.status.incomplete &&
      this.state.datasets.currentUploadId !== dataset._id
    ) {
      return (
        <div className="col-xs-12 incomplete-dataset">
          <div className="incomplete-wrap fade-in panel-group">
            <div className="panel panel-default status">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <span className="dataset-status ds-warning">
                    <i className="fa fa-warning" /> Incomplete
                  </span>
                  <FileSelect
                    resume={true}
                    onChange={this._onFileSelect.bind(this)}
                  />
                </h4>
              </div>
              <div className="panel-collapse" aria-expanded="false">
                <div className="panel-body">
                  You will have limited functionality on this dataset until it
                  is completed. Please click resume to finish uploading.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // custom methods -----------------------------------------------------

  _modified(modified) {
    let dateModified = moment(modified).format('L')
    let timeago = moment(modified).fromNow(true)
    return <h6>{'last modified ' + dateModified + ' - ' + timeago + ' ago'}</h6>
  }

  _uploaded(dataset) {
    let user = dataset ? dataset.user : null
    let dateCreated = dataset.created
    let dateAdded = moment(dateCreated).format('L')
    let timeago = moment(dateCreated).fromNow(true)
    return (
      <h6>
        {'uploaded ' +
          (user ? 'by ' + user.firstname + ' ' + user.lastname : '') +
          ' on ' +
          dateAdded +
          ' - ' +
          timeago +
          ' ago'}
      </h6>
    )
  }

  _views(views) {
    if (views) {
      return <h6>views: {views}</h6>
    }
  }

  _onFileSelect(files) {
    uploadActions.onResume(files, this.state.datasets.dataset.label)
  }
}

Dataset.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
}

export default withRouter(Dataset)
