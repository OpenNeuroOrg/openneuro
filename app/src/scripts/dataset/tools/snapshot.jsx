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
    this.state = {
      show: this.props.show,
      changes: [],
      currentChange: '',
      currentVersion: '',
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
    this.setState({
      currentVersion: value,
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

  _version() {
    return (
      <div className="snapshot-version col-xs-12">
        <Input
          placeholder="1.0.2"
          type="text"
          value={this.state.currentVersion}
          onChange={this._handleVersion}
          name="version"
        />
      </div>
    )
  }

  _changes() {
    let content = []
    // add an input form for a new change
    let input = (
      <div className="new-change" key="new-change">
        <Input
          placeholder="Enter new change here..."
          type="text"
          value={this.state.currentChange}
          onChange={this._handleChange}
          name="change"
        />
        <div className="submit-change">
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
    return <div className="changes col-xs-12">{content}</div>
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
