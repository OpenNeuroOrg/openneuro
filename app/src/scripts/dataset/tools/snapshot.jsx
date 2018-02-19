import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../common/forms/input.jsx'
import actions from '../dataset.actions'
import datasetStore from '../dataset.store'
import { Modal } from '../../utils/modal.jsx'
import { withRouter } from 'react-router-dom'

class Snapshot extends React.Component {
  constructor(props) {
    super(props)
    let snapshotVersions =
      datasetStore.data.snapshots && datasetStore.data.snapshots.length
        ? datasetStore.data.snapshots
            .filter(snap => {
              return typeof snap.snapshot_version !== 'undefined'
            })
            .map(snap => {
              return snap.snapshot_version
            })
        : null
    let latestVersion = snapshotVersions
      ? Math.max.apply(null, snapshotVersions) + 1
      : 1
    this.state = {
      show: this.props.show,
      changes: [],
      currentChange: '',
      currentVersion: {
        major: latestVersion,
        minor: '0',
        point: '0',
      },
      lastSnapshotVersion: latestVersion,
    }
    this._handleChange = this.handleChange.bind(this)
    this._handleVersion = this.handleVersion.bind(this)
    this._addChange = this.submitChange.bind(this)
    this._removeChange = this.removeChange.bind(this)
    this._submit = this.submit.bind(this)
    this._onHide = this.onHide.bind(this)
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

  _modalContent() {
    if (!this.state.error) {
      return (
        <div className="modal-content">
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
    return (
      <div className="snapshot-version col-xs-12">
        <div className="col-xs-12">
          <h4>Snapshot Version: {this._versionString()}</h4>
        </div>
        <div className="snapshot-version-major form-group col-xs-4">
          <label htmlFor="major" className="control-label">
            Major
          </label>
          <input
            placeholder={this.state.lastSnapshotVersion}
            type="number"
            step="1"
            min={this.state.lastSnapshotVersion}
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
        </div>
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
          <h4>Changelog</h4>
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

  submit() {
    actions.createSnapshot(this.props.history, res => {
      if (res && res.error) {
        this.setState({
          error: true,
          message: res.error,
        })
      } else {
        this.onHide()
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
    this.props.onHide()
  }

  _submitButton() {
    if (!this.state.error) {
      return (
        <button className="btn-modal-submit" onClick={this.submit.bind(this)}>
          create snapshot
        </button>
      )
    }
  }

  _returnButton() {
    let buttonText = this.state.error ? 'OK' : 'Cancel'
    let btnClass = this.state.error ? 'btn-admin-blue' : 'btn-reset'
    return (
      <button className={btnClass} onClick={this._onHide.bind(this)}>
        {buttonText}
      </button>
    )
  }

  render() {
    return (
      <Modal
        className="snapshot-modal"
        show={this.props.show}
        onHide={this._onHide.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Snapshot</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="dataset">{this._modalContent()}</div>
          <div className="modal-controls">
            {this._submitButton()}
            {this._returnButton()}
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

Snapshot.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  history: PropTypes.object,
}

export default withRouter(Snapshot)
