// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import { Redirect, Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import { ProgressBar } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Spinner from '../common/partials/spinner.jsx'
import Timeout from '../common/partials/timeout.jsx'
import datasetStore from './dataset.store'
import actions from './dataset.actions.js'
import MetaData from './dataset.metadata.jsx'
import Tools from './tools'
import Statuses from './dataset.statuses.jsx'
import Validation from './dataset.validation.jsx'
import ClickToEdit from '../common/forms/click-to-edit.jsx'
import FileTree from '../common/partials/file-tree.jsx'
import Jobs from './dataset.jobs.jsx'
import ErrorBoundary from '../errors/errorBoundary.jsx'
import userStore from '../user/user.store.js'
import Summary from './dataset.summary.jsx'
import Comment from '../common/partials/comment.jsx'
import CommentTree from '../common/partials/comment-tree.jsx'
import FileSelect from '../common/forms/file-select.jsx'
import uploadActions from '../upload/upload.actions.js'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'
import { pageTitle } from '../resources/strings'

const uploadWarning =
  'You are currently uploading files. Leaving this page will cancel the upload process.'

class Dataset extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')
    const isDataset = pathname => {
      const slugs = pathname.split('/')
      if (
        slugs.length &&
        slugs[1] === 'datasets' &&
        this.state.datasets.dataset
      ) {
        let datasetId = this.state.datasets.dataset.linkID
        if ('linkOriginal' in this.state.datasets.dataset) {
          datasetId = this.state.datasets.dataset.linkOriginal
        }
        // The same dataset
        if (slugs[2] === datasetId) {
          return true
        }
      }
      return false
    }
    const unblock = props.history.block(({ pathname }) => {
      if (!isDataset(pathname) && this.state.datasets.uploading) {
        return uploadWarning
      }
    })
    this.state = { unblock }
  }
  // life cycle events --------------------------------------------------

  componentWillReceiveProps(nextProps) {
    this._loadData(
      nextProps.match.params.datasetId,
      nextProps.match.params.snapshotId,
    )
  }

  componentWillUpdate() {
    // Prevent navigation away if adding a directory
    if (this.state.datasets.uploading) {
      window.onbeforeunload = () => {
        // Warning not shown in modern browsers but we have to return something
        return uploadWarning
      }
    } else {
      window.onbeforeunload = () => {}
    }
  }

  componentDidMount() {
    const datasetId = this.props.match.params.datasetId
    const snapshotId = this.props.match.params.snapshotId
    this._loadData(datasetId, snapshotId)
    const isDataset = pathname => {
      const slugs = pathname.split('/')
      if (
        slugs.length &&
        slugs[1] === 'datasets' &&
        this.state.datasets.dataset
      ) {
        let datasetId = this.state.datasets.dataset.linkID
        if ('linkOriginal' in this.state.datasets.dataset) {
          datasetId = this.state.datasets.dataset.linkOriginal
        }
        // The same dataset
        if (slugs[2] === datasetId) {
          return true
        }
      }
      return false
    }
    this.props.history.listen(({ pathname }) => {
      if (!isDataset(pathname) && this.state.datasets.uploading) {
        actions.cancelDirectoryUpload()
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
        datasetId: bids.encodeId(datasetId),
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
    window.onbeforeunload = () => {}
    if (this.state.unblock) {
      this.state.unblock()
    }
  }

  render() {
    console.log(
      'rendering dataset with the following state:',
      this.state.datasets.dataset,
    )
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
      let errors = dataset.validation.errors
      let warnings = dataset.validation.warnings
      // meta description is README unless it's empty
      const description = dataset.README ? dataset.README : dataset.label
      content = (
        <div className="clearfix dataset-wrap">
          <Helmet>
            <title>
              {pageTitle} - {dataset.label}
            </title>
            <meta name="description" content={description} />
          </Helmet>
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
                  {this._commentTree()}
                </div>
                <div className="col-xs-6">
                  <div>
                    <Validation
                      errors={errors}
                      warnings={warnings}
                      validating={dataset.status.validating}
                      display={
                        !dataset.status.incomplete &&
                        !this.state.datasets.uploading
                      }
                    />
                    <div className="fade-in col-xs-12">
                      <ErrorBoundary message="The server failed to provide OpenNeuro with a list of jobs.">
                        <Jobs />
                      </ErrorBoundary>
                    </div>
                    <div className="dataset-files">
                      {this._incompleteMessage(dataset)}
                      {this._fileTree.bind(this)(dataset, canEdit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      if (this.state.datasets.redirectUrl) {
        content = <Redirect to={this.state.datasets.redirectUrl} />
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
          <ErrorBoundary
            message="The dataset has failed to load in time. Please check your network connection."
            className="col-xs-12 dataset-inner dataset-route dataset-wrap inner-route light text-center">
            <div className="fade-in inner-route dataset-route light">
              {this.state.datasets.loading ? (
                <Timeout timeout={20000}>
                  <Spinner active={true} text={loadingText} />
                </Timeout>
              ) : (
                content
              )}
            </div>
          </ErrorBoundary>
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
            uploading={this.state.datasets.uploading}
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
      } else if (snapshot.isOriginal && this.state.datasets.uploading) {
        analysisCount = (
          <span className="job-count">
            <span className="warning-loading">
              <i className="fa fa-spin fa-circle-o-notch" />
            </span>
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
    let fileTree = (
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
    )
    if (this.state.datasets.uploading && !('original' in dataset)) {
      const max = this.state.datasets.uploadingFileCount
      const now = this.state.datasets.uploadingProgress
      const progress = {
        max,
        now,
        label: now + '/' + max + ' files uploaded',
      }
      fileTree = (
        <ul className="uploading-directory">
          <li className="clearfix uploading-spinner">
            <Spinner active={true} text="Adding files..." />
          </li>
          <li className="clearfix uploading-progress">
            <ProgressBar active {...progress} />
          </li>
        </ul>
      )
    }

    if (!dataset.status.incomplete) {
      return (
        <div className="col-xs-12">
          <div className="file-structure fade-in panel-group">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Dataset File Tree</h3>
              </div>
              <div className="panel-collapse" aria-expanded="false">
                <div className="panel-body">{fileTree}</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  _commentTree() {
    // add a top level comment box to the dataset if user is logged in
    let loggedIn = !!userStore.hasToken()
    let isAdmin =
      loggedIn && this.state.datasets.currentUser
        ? this.state.datasets.currentUser.scitran.root
        : false
    console.log(
      'rendering comment tree with current state:',
      this.state.datasets,
    )
    console.log('and isAdmin:', isAdmin)
    let content = []
    if (loggedIn) {
      content.push(
        <div className="comment-box top-level" key="topComment">
          <Comment
            createComment={actions.createComment}
            parentId={null}
            show={true}
            new={true}
          />
        </div>,
      )
    } else {
      content.push(
        <div className="login-for-comments">
          Please login to contribute to the discussion
        </div>,
      )
    }

    // construct comment tree
    for (let comment of this.state.datasets.commentTree) {
      content.push(
        <div key={comment._id}>
          <CommentTree
            uploadUser={this.state.datasets.dataset.user}
            user={this.state.datasets.currentUser.profile}
            isAdmin={isAdmin}
            node={comment}
            datasetId={this.props.match.params.datasetId}
            createComment={actions.createComment}
            deleteComment={actions.deleteComment}
            updateComment={actions.updateComment}
            isParent={true}
          />
        </div>,
      )
    }
    return (
      <div className="dataset-comments">
        <div className="comment-header">COMMENTS</div>
        <div className="comments">{content}</div>
      </div>
    )
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
