// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import actions from '../dataset.actions.js'
import { Modal } from '../../utils/modal.jsx'
import moment from 'moment'

class Publish extends React.Component {
  // life cycle events --------------------------------------------------

  constructor() {
    super()
    this.state = {
      loading: false,
      selectedSnapshot: '',
      message: null,
      error: false,
    }
  }

  componentWillReceiveProps() {
    this.props.snapshots.map(snapshot => {
      if (snapshot._id == this.props.dataset._id) {
        if (snapshot.original) {
          this.setState({ selectedSnapshot: snapshot._id })
        } else if (this.props.snapshots.length > 1) {
          this.setState({ selectedSnapshot: this.props.snapshots[1]._id })
        }
        return
      }
    })
  }

  _closeButton() {
    return (
      <Link to={this.props.location.pathname}>
        <button type="button" className="close">
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
      </Link>
    )
  }

  render() {
    let form = (
      <div className="analysis-modal clearfix">
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
        {this._submit()}
      </div>
    )

    let message = (
      <div>
        <div className={this.state.error ? 'alert alert-danger' : null}>
          {this.state.error ? <h4 className="danger">Error</h4> : null}
          <h5>{this.state.message}</h5>
        </div>
        <Link to={this.props.location.pathname}>
          <button className="btn-admin-blue" onClick={this._hide.bind(this)}>
            OK
          </button>
        </Link>
      </div>
    )

    let body
    if (this.state.message) {
      body = message
    } else {
      body = form
    }

    return (
      <Modal show={this.props.show} onHide={this._hide.bind(this)}>
        <Modal.Header>
          {this._closeButton()}
          <Modal.Title>Publish</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="dataset">{body}</div>
        </Modal.Body>
      </Modal>
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
    if (this.props.snapshots) {
      options = this.props.snapshots.map(snapshot => {
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
              <Link to={this.props.location.pathname + '?modal=snapshot'}>
                <button
                  className="btn-reset"
                  // onClick={this._createSnapshot.bind(this)}
                >
                  Create New Snapshot
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
          <Link to={this.props.location.pathname}>
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
    this.props.onHide()
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
}

export default withRouter(Publish)
