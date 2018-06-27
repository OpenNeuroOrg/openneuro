// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import adminStore from './admin.store'
import actions from './admin.actions'
import Input from '../common/forms/input.jsx'
import { Modal } from '../utils/modal.jsx'
import { refluxConnect } from '../utils/reflux'

class BlacklistModal extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, adminStore, 'admin')
  }
  // life cycle events --------------------------------------------------

  render() {
    let blacklistForm = this.state.admin.blacklistForm

    return (
      <Modal show={this.state.admin.modals.blacklist} onHide={this._hide}>
        <Modal.Header closeButton>
          <Modal.Title>Block a User</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="blacklist-modal">
            {this._blacklistError()}
            <Input
              placeholder="Gmail Address"
              type="text"
              value={blacklistForm._id}
              name={'_id'}
              onChange={this._inputChange}
            />
            <Input
              placeholder="Name"
              type="text"
              value={blacklistForm.name}
              name={'name'}
              onChange={this._inputChange}
            />
            <Input
              placeholder="Note"
              type="textarea"
              value={blacklistForm.note}
              name={'note'}
              onChange={this._inputChange}
            />
            <button
              className="btn-modal-submit"
              onClick={actions.blacklistSubmit}>
              <span>Block</span>
            </button>
            <button className="btn-reset" onClick={this._hide}>
              close
            </button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  // custom methods -----------------------------------------------------

  _blacklistError() {
    return this.state.admin.blacklistError ? (
      <div className="alert alert-danger">
        {this.state.admin.blacklistError}
      </div>
    ) : null
  }

  _inputChange(e) {
    actions.inputChange('blacklistForm', e.target.name, e.target.value)
  }

  _hide() {
    actions.toggleModal('blacklist')
  }
}

export default BlacklistModal
