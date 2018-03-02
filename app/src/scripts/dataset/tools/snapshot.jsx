import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Spinner from '../../common/partials/spinner.jsx'
import Timeout from '../../common/partials/timeout.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import moment from 'moment'
import actions from '../dataset.actions'
import datasetStore from '../dataset.store'
import bids from '../../utils/bids'
import { Link, withRouter } from 'react-router-dom'
import { refluxConnect } from '../../utils/reflux'

class Snapshot extends Reflux.Component {
  constructor(props) {
    super(props)
    refluxConnect(this, datasetStore, 'datasets')

    this.state = {
      changes: [],
      currentChange: '',
      currentVersion: {
        major: '',
        minor: '',
        point: '',
      },
      latestVersion: '',
    }
    this._handleChange = this.handleChange.bind(this)
    this._handleVersion = this.handleVersion.bind(this)
    this._addChange = this.submitChange.bind(this)
    this._removeChange = this.removeChange.bind(this)
    this._submit = this.submit.bind(this)
    this._onHide = this.onHide.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let reload = false
    let datasetId = nextProps.match.params.datasetId
    let snapshotId = nextProps.match.params.snapshotId
    let snapshots = this.state.datasets.snapshots
    let dataset = this.state.datasets.dataset
    if (snapshotId) {
      const snapshotUrl = bids.encodeId(datasetId, snapshotId)
      if (snapshotUrl !== this.state.datasets.loadedUrl) {
        reload = true
      }
    } else {
      const datasetUrl = bids.encodeId(datasetId)
      if (datasetUrl !== this.state.datasets.loadedUrl) {
        reload = true
      }
    }

    if (reload) {
      this._loadData(
        nextProps.match.params.datasetId,
        nextProps.match.params.snapshotId,
      )
    }

    snapshots.map(snapshot => {
      if (snapshot._id == dataset._id) {
        if (snapshot.original) {
          this.setState({ selectedSnapshot: snapshot._id })
        } else if (snapshots.length > 1) {
          this.setState({ selectedSnapshot: snapshots[1]._id })
        }
        return
      }
    })

    let snapshotVersion =
      this.state.datasets &&
      this.state.datasets.dataset &&
      this.state.datasets.dataset.snapshot_version
        ? this.state.datasets.dataset.snapshot_version + 1
        : 1

    this.setState({
      currentVersion: {
        major: snapshotVersion,
        minor: '0',
        point: '0',
      },
      latestVersion: snapshotVersion,
      newSnapshotVersion: snapshotVersion,
    })
  }

  componentDidMount() {
    const datasetId = this.props.match.params.datasetId
    const snapshotId = this.props.match.params.snapshotId
    this._loadData(datasetId, snapshotId)
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

  handleChange(e) {
    let value = e.currentTarget.value
    this.setState({
      currentChange: value,
    })
  }

  handleVersion(e) {
    let value = e.currentTarget.value
    let name = e.currentTarget.name
    let version = this.state.currentVersion
    version[name] = value
    this.setState({
      currentVersion: version,
    })
  }

  _formContent() {
    if (!this.state.error) {
      return (
        <div className="snapshot-form-inner">
          {this._version()}
          {this._changes()}
        </div>
      )
    } else {
      return this._error()
    }
  }

  _versionString() {
    return (
      this.state.currentVersion.major +
      '.' +
      this.state.currentVersion.minor +
      '.' +
      this.state.currentVersion.point
    )
  }

  _version() {
    // TODO: allow the user to select version numbers when we have a
    // system that has a point system versioning
    return (
      <div className="snapshot-version col-xs-12">
        <div className="col-xs-12">
          <h4>Snapshot Version: {this._versionString()}</h4>
        </div>

        {/* <div className="snapshot-version-major form-group col-xs-4">
          <label htmlFor="major" className="control-label">
            Major
          </label>
          <input
            placeholder={this.state.newSnapshotVersion}
            type="number"
            step="1"
            min={this.state.newSnapshotVersion}
            max={this.state.newSnapshotVersion}
            value={this.state.currentVersion.major}
            onChange={this._handleVersion}
            name="major"
            title="major"
            className="form-control"
          />
        </div>
        <div className="snapshot-version-minor form-group col-xs-4">
          <label htmlFor="minor" className="control-label">
            Minor
          </label>
          <input
            placeholder="0"
            type="number"
            step="1"
            value={this.state.currentVersion.minor}
            onChange={this._handleVersion}
            name="minor"
            title="minor"
            className="form-control"
            disabled={true}
          />
        </div>
        <div className="snapshot-version-point form-group col-xs-4">
          <label htmlFor="point" className="control-label">
            Point
          </label>
          <input
            placeholder="1"
            type="number"
            step="1"
            value={this.state.currentVersion.point}
            onChange={this._handleVersion}
            name="point"
            title="point"
            className="form-control"
            disabled={true}
          />
        </div> */}
      </div>
    )
  }

  _changes() {
    let content = []
    // add an input form for a new change
    let input = (
      <div className="new-change col-xs-12" key="new-change">
        <div className="col-xs-9 form-group">
          <input
            placeholder="Enter new change here..."
            type="text"
            value={this.state.currentChange}
            onChange={this._handleChange}
            name="change"
            className="form-control"
          />
        </div>
        <div className="submit-change col-xs-3">
          <button
            className="submit btn-admin-blue add-btn"
            onClick={this._addChange}>
            <i className="fa fa-plus" />Add
          </button>
        </div>
      </div>
    )
    content.push(input)

    // add existing changes as list items
    this.state.changes.forEach((change, idx) => {
      let existingChange = (
        <div className="change col-xs-12" key={idx}>
          <div className="change-list-icon col-xs-1">
            <i className="fa fa-minus" />
          </div>
          <div className="change-text col-xs-8">{change}</div>
          <div className="col-xs-3 change-controls">
            <a className="" onClick={this._removeChange.bind(this, change)}>
              <i className="fa fa-times" />Remove
            </a>
          </div>
        </div>
      )
      content.push(existingChange)
    })
    return (
      <div className="changes col-xs-12">
        <div className="col-xs-12">
          <h4>Generate Changelog:</h4>
        </div>
        {content}
      </div>
    )
  }

  _error() {
    return (
      <div>
        <div className={this.state.error ? 'alert alert-danger' : null}>
          {this.state.error ? <h4 className="danger">Error</h4> : null}
          <h5>{this.state.message}</h5>
        </div>
      </div>
    )
  }

  submitChange() {
    let changes = this.state.changes
    if (this.state.currentChange) {
      changes.push(this.state.currentChange)
    }
    this.setState({
      changes: changes,
      currentChange: '',
    })
  }

  removeChange(change) {
    let changes = this.state.changes
    let newChanges = changes.filter(c => {
      return c !== change
    })
    this.setState({
      changes: newChanges,
    })
  }

  joinChangelogs(changesArray, oldChangelog) {
    let dateString = moment().format('YYYY-MM-DD')
    let versionString = this._versionString()
    let headerString = versionString + '\t' + dateString + '\n\n'
    let changeText = headerString
    changesArray.forEach(change => {
      changeText += '\t- ' + change + '\n'
    })
    let newChangelog = changeText + '\n' + oldChangelog
    return newChangelog
  }

  submit() {
    let changes = this.joinChangelogs(
      this.state.changes,
      this.state.datasets.dataset.CHANGES,
    )

    actions.updateCHANGES(changes, (err, res) => {
      if (err) {
        return
      } else {
        if (res) {
          actions.createSnapshot(this.props.history, res => {
            if (res && res.error) {
              this.setState({
                error: true,
                message: res.error,
              })
            }
          })
        }
      }
    })
  }

  onHide() {
    this.setState({
      changes: [],
      currentChange: '',
      error: false,
      message: null,
    })
  }

  _submitButton() {
    if (!this.state.error) {
      let disabled = this.state.changes.length < 1
      let buttonTitle = disabled ? 'Please enter at least one change' : 'Submit'
      if (disabled) {
        return (
          <span className="text-danger changelog-length-warning">
            {' '}
            * Please enter at least one change to submit this snapshot{' '}
          </span>
        )
      } else {
        return (
          <button
            className="btn-modal-submit btn-dataset-submit"
            onClick={this.submit.bind(this)}
            title={buttonTitle}
            disabled={disabled}>
            create snapshot
          </button>
        )
      }
    }
  }

  _returnButton() {
    let buttonText = this.state.error ? 'OK' : 'Cancel'
    let btnClass = this.state.error ? 'btn-admin-blue' : 'btn-reset'
    let fromModal =
      this.props.location.state && this.props.location.state.fromModal
        ? this.props.location.state.fromModal
        : null
    let returnUrl = fromModal
      ? this.state.datasets.datasetUrl + '/' + fromModal
      : this.state.datasets.datasetUrl
    if (returnUrl) {
      return (
        <Link to={returnUrl}>
          <button className={btnClass}>{buttonText}</button>
        </Link>
      )
    } else {
      return null
    }
  }

  render() {
    let datasets = this.state.datasets
    let loading = datasets && datasets.loading
    let loadingText =
      datasets && typeof datasets.loading == 'string'
        ? datasets.loading
        : 'loading'
    let content = (
      <div className="dataset-form">
        <div className="col-xs-12 dataset-form-header">
          <div className="form-group">
            <label>Create Snapshot</label>
          </div>
          <hr className="modal-inner" />
        </div>
        <div className="dataset-form-body col-xs-12">
          <div className="dataset-form-content col-xs-12">
            {this._formContent()}
          </div>
          <div className="dataset-form-controls col-xs-12">
            {this._returnButton()}
            {this._submitButton()}
          </div>
        </div>
      </div>
    )
    return (
      <ErrorBoundary
        message="The dataset has failed to load in time. Please check your network connection."
        className="col-xs-12 dataset-inner dataset-route dataset-wrap inner-route light text-center">
        {loading ? (
          <Timeout timeout={20000}>
            <Spinner active={true} text={loadingText} />
          </Timeout>
        ) : (
          content
        )}
      </ErrorBoundary>
    )
  }
}

Snapshot.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
}

export default withRouter(Snapshot)
