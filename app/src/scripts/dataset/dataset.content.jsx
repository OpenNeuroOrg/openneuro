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
import ErrorBoundary from '../errors/errorBoundary.jsx'
import datasetStore from './dataset.store'
import actions from './dataset.actions.js'
import MetaData from './dataset.metadata.jsx'
import Statuses from './dataset.statuses.jsx'
import Validation from './dataset.validation.jsx'
import ClickToEdit from '../common/forms/click-to-edit.jsx'
import FileTree from '../common/partials/file-tree.jsx'
import Jobs from './dataset.jobs.jsx'
import userStore from '../user/user.store.js'
import Summary from './dataset.summary.jsx'
import Comment from '../common/partials/comment.jsx'
import CommentTree from '../common/partials/comment-tree.jsx'
import FileSelect from '../common/forms/file-select.jsx'
import uploadActions from '../upload/upload.actions.js'
import userActions from '../user/user.actions.js'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'

let uploadWarning =
  'You are currently uploading files. Leaving this page will cancel the upload process.'

class DatasetContent extends Reflux.Component {
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

  componentDidMount() {
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

  componentWillUnmount() {
    actions.setInitialState({ apps: this.state.datasets.apps })
    super.componentWillUnmount()
    window.onbeforeunload = () => {}
    if (this.state.unblock) {
      this.state.unblock()
    }
  }

  render() {
    let dataset = this.state.datasets.dataset
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
      content = (
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
                  !dataset.status.incomplete && !this.state.datasets.uploading
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
      <ErrorBoundary
        message="The dataset has failed to load in time. Please check your network connection."
        className="col-xs-12 dataset-inner dataset-route dataset-wrap inner-route light text-center">
        {this.state.datasets.loading ? (
          <Timeout timeout={20000}>
            <Spinner active={true} text={loadingText} />
          </Timeout>
        ) : (
          content
        )}
      </ErrorBoundary>
    )
  }

  // template methods ---------------------------------------------------

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
        history={this.props.history}
        loading={this.state.datasets.loadingTree}
        dismissError={actions.dismissError}
        deleteFile={actions.deleteFile}
        getFileDownloadTicket={actions.getFileDownloadTicket}
        displayFile={actions.displayFile.bind(this, null, null)}
        editFile={actions.editFile.bind(this, null, null)}
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

  _commentHeader() {
    let sortBar
    if (this.state.datasets.commentTree.length) {
      sortBar = (
        <span className="comment-sort">
          SORT BY:
          <select
            value={this.state.datasets.commentSortOrder}
            onChange={actions.sortComments}
            className="comment-sort-select">
            <option value="ASC">Date: Newest First</option>
            <option value="DESC">Date: Oldest First</option>
          </select>
        </span>
      )
    }
    let uploaderFollowing
    if (this.state.datasets.dataset.uploaderSubscribed) {
      uploaderFollowing = (
        <span className="uploader-following">
          <i className="fa fa-user" />Uploader is Following
        </span>
      )
    }
    let content = (
      <div className="comment-header">
        <label>COMMENTS</label>
        <div>
          {uploaderFollowing}
          {sortBar}
        </div>
      </div>
    )

    return content
  }
  _commentTree() {
    // add a top level comment box to the dataset if user is logged in
    let loggedIn = !!userStore.hasToken()
    let isAdmin =
      loggedIn && this.state.datasets.currentUser
        ? this.state.datasets.currentUser.scitran.root
        : false

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
        <div key="commentLoginMessage" className="login-for-comments">
          Please{' '}
          <a onClick={userActions.toggle.bind(this, 'loginModal')}>sign in</a>{' '}
          to contribute to the discussion.
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
        {this._commentHeader()}
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

DatasetContent.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
}

export default withRouter(DatasetContent)
