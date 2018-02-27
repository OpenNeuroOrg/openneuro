// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import Spinner from '../../common/partials/spinner.jsx'
import Timeout from '../../common/partials/timeout.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import { Link, withRouter } from 'react-router-dom'
import actions from '../dataset.actions.js'
import datasetStore from '../dataset.store.js'
import moment from 'moment'
import bids from '../../utils/bids'
import { refluxConnect } from '../../utils/reflux'

class Publish extends Reflux.Component {
  // life cycle events --------------------------------------------------

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      selectedSnapshot: '',
      message: null,
      error: false,
    }
    refluxConnect(this, datasetStore, 'datasets')
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

    if (reload && !this.state.datasets.dataset) {
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

  constructReturnUrl(params) {
    if (params.snapshotId) {
      return '/datasets/' + params.datasetId + '/versions/' + params.snapshotId
    } else {
      return '/datasets/' + params.datasetId
    }
  }

  _closeButton() {
    return (
      <Link to={this.constructReturnUrl(this.props.match.params)}>
        <button type="button" className="close">
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
      </Link>
    )
  }

  render() {
    let datasets = this.state.datasets
    let loading = datasets && datasets.loading
    let loadingText =
      datasets && typeof datasets.loading == 'string'
        ? datasets.loading
        : 'loading'

    let message = (
      <div>
        <div className={this.state.error ? 'alert alert-danger' : null}>
          {this.state.error ? <h4 className="danger">Error</h4> : null}
          <h5>{this.state.message}</h5>
        </div>
        <Link to={this.constructReturnUrl(this.props.match.params)}>
          <button className="btn-admin-blue" onClick={this._hide.bind(this)}>
            OK
          </button>
        </Link>
      </div>
    )

    let form = (
      <div className="dataset-form-body col-xs-12">
        <div className="dataset-form-content col-xs-12">
          {this._snapshots()}
          <p className="text-danger">
            This snapshot will be released publicly under a
            <a
              href="https://wiki.creativecommons.org/wiki/CC0"
              target="_blank"
              rel="noopener noreferrer">
              {' '}
              CC0 license
            </a>. This operation cannot be undone.
          </p>
        </div>
        <div className="dataset-form-controls col-xs-12">{this._submit()}</div>
      </div>
    )

    let body
    if (this.state.message) {
      body = message
    } else {
      body = form
    }

    let content = (
      <div className="dataset-form">
        <div className="col-xs-12 dataset-form-header">
          <div className="form-group">
            <label>Publish</label>
          </div>
          {body}
        </div>
      </div>
    )

    return (
      <ErrorBoundary
        message="The dataset has failed to load in time. Please check your network connection."
        className="col-xs-12 dataset-inner dataset-route dataset-wrap inner-route light text-center">
        <div className="fade-in inner-route dataset-route light">
          {loading ? (
            <Timeout timeout={20000}>
              <Spinner active={true} text={loadingText} />
            </Timeout>
          ) : (
            content
          )}
        </div>
      </ErrorBoundary>
    )
  }

  // template methods ---------------------------------------------------

  /**
   * Snapshots
   *
   * Returns a labeled select box for selecting a snapshot
   * to run analysis on.
   */
  _snapshots() {
    let options = []
    let snapshots = this.state.datasets.snapshots
    if (snapshots) {
      options = snapshots.map(snapshot => {
        if (!snapshot.isOriginal && !snapshot.orphaned) {
          return (
            <option
              key={snapshot._id}
              value={snapshot._id}
              disabled={snapshot.public}>
              {'v' +
                snapshot.snapshot_version +
                ' (' +
                moment(snapshot.modified).format('lll') +
                ')'}
              {snapshot.public ? '- published' : null}
            </option>
          )
        }
      })
    }
    return (
      <div>
        <h5>Choose a snapshot to publish</h5>
        <div className="row">
          <div className="col-xs-12">
            <div className="col-xs-6 task-select">
              <select
                value={this.state.selectedSnapshot}
                onChange={this._selectSnapshot.bind(this)}>
                <option value="" disabled>
                  Select a Snapshot
                </option>
                {options}
              </select>
            </div>
            <div className="col-xs-6 default-reset">
              {this._createNewSnapshot()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  _createNewSnapshot() {
    let dataset = datasetStore.data.dataset
    let snapshots = datasetStore.data.snapshots
    let modified = !(
      snapshots.length > 1 &&
      moment(dataset.modified).diff(moment(snapshots[1].modified)) <= 0
    )
    if (modified) {
      let to = {
        pathname:
          this.constructReturnUrl(this.props.match.params) + '/create-snapshot',
        state: {
          fromModal: 'publish',
        },
      }
      return (
        <Link to={to}>
          <button className="btn-reset">Create New Snapshot</button>
        </Link>
      )
    } else {
      return null
    }
  }

  _submit() {
    if (this.state.selectedSnapshot) {
      return (
        <div className="col-xs-12 modal-actions">
          <button
            className="btn-modal-submit"
            onClick={this._publish.bind(this)}>
            Publish
          </button>
          <Link to={this.constructReturnUrl(this.props.match.params)}>
            <button
              className="btn-reset"
              // onClick={this._hide.bind(this)}
            >
              close
            </button>
          </Link>
        </div>
      )
    }
  }

  // actions ------------------------------------------------------------

  /**
   * Hide
   */
  _hide() {
    this.setState({
      loading: false,
      selectedSnapshot: '',
      message: null,
      error: false,
    })
  }

  /**
   * Select Snapshot
   */
  _selectSnapshot(e) {
    let snapshotId = e.target.value
    this.setState({ selectedSnapshot: snapshotId })
  }

  /**
   * Create Snapshot
   */
  _createSnapshot() {
    this.setState({ loading: true })
    actions.createSnapshot.bind(null, this.props.history)(res => {
      if (res.error) {
        this.setState({
          error: true,
          message: res.error,
          loading: false,
        })
      } else {
        this.setState({
          selectedSnapshot: res,
          loading: false,
        })
      }
    }, false)
  }

  /**
   * Publish
   */
  _publish() {
    actions.publish(
      this.state.selectedSnapshot,
      true,
      this.props.history,
      this._hide.bind(this),
    )
  }
}

Publish.propTypes = {
  snapshots: PropTypes.array,
  dataset: PropTypes.object,
  loadingApps: PropTypes.bool,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  returnUrl: PropTypes.string,
}

export default withRouter(Publish)
