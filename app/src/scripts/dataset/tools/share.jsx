/*eslint react/no-did-mount-set-state: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import bids from '../../utils/bids'
import Input from '../../common/forms/input.jsx'
import WarnButton from '../../common/forms/warn-button.jsx'
import { Modal } from '../../utils/modal.jsx'
import userStore from '../../user/user.store'

class Share extends React.Component {
  // life cycle events --------------------------------------------------

  constructor() {
    super()
    this.state = {
      edit: true,
      error: null,
      users: [],
      permissions: [],
      input: '',
      select: '',
    }
  }

  componentWillReceiveProps() {
    this.setState({
      users: this.props.users,
      permissions: this.props.dataset.permissions,
    })
  }

  componentDidMount() {
    this.setState({
      users: this.props.users,
      permissions: this.props.dataset.permissions,
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
    let instruction =
      "Enter a user's email address and select access level to share"

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        className="share-modal">
        <Modal.Header>
          {this._closeButton()}
          <Modal.Title>Share Dataset</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="dataset">
            <h5>Dataset shared with:</h5>
            <div className="cte-array-items">
              {this._permissions(this.state.permissions)}
            </div>
            <h5 className="add-members">{instruction}</h5>
            <div>
              <div className="text-danger">{this.state.error}</div>
              <Input
                value={this.state.input}
                onChange={this._inputChange.bind(this)}
              />
              <select
                className="select-box-style"
                onChange={this._selectChange.bind(this)}
                value={this.state.select}>
                <option value="" disabled>
                  access level
                </option>
                <option value="ro">Can view</option>
                <option value="rw">Can edit</option>
                <option value="admin">Administrator</option>
              </select>
              <span className="caret-down" />
              <button
                className="btn-modal-submit"
                onClick={this._addUser.bind(this)}>
                share
              </button>
              <Link to={this.props.location.pathname}>
                <button
                  className="btn-reset"
                  // onClick={this.props.onHide}
                >
                  close
                </button>
              </Link>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  // template methods ---------------------------------------------------

  _permissions(permissions) {
    let accessKey = {
      admin: 'Administrator',
      rw: 'Can edit',
      ro: 'Can view',
    }

    return permissions.map(user => {
      let remove =
        userStore.data.profile && userStore.data.profile._id !== user._id ? (
          <WarnButton
            message="Remove"
            action={this._removeUser.bind(this, user._id)}
          />
        ) : null
      return (
        <div key={user._id} className="cte-array-item">
          <span className="share-name">{user._id}</span>{' '}
          <span className="share-access">- {accessKey[user.access]}</span>
          <div className="btn-wrap">{remove}</div>
        </div>
      )
    })
  }

  // custom methods -----------------------------------------------------

  _toggleEdit() {
    this.setState({ edit: !this.state.edit })
  }

  _inputChange(e) {
    this.setState({ input: e.target.value })
  }

  _selectChange(e) {
    let select = e.target.value
    this.setState({ select })
  }

  _addUser() {
    this.setState({ error: null })

    // check name and access level are selected
    if (this.state.input.length < 1 || this.state.select.length < 1) {
      this.setState({
        error:
          'You must enter a valid email address and select an access level',
      })
      return
    }

    // check if user is already a member
    let isMember = false
    for (let user of this.state.permissions) {
      if (this.state.input === user._id) {
        isMember = true
      }
    }
    if (isMember) {
      this.setState({ error: 'This dataset is already shared with this user' })
      return
    }

    // check if user exists
    let userExists = false
    for (let user of this.state.users) {
      if (this.state.input === user._id) {
        userExists = true
      }
    }
    if (!userExists) {
      this.setState({
        error:
          'A user does not exist with that email. Make sure you enter a valid email address for a registered user',
      })
      return
    }

    // add member
    let role = {
      _id: this.state.input,
      access: this.state.select,
    }
    bids.addPermission(this.props.dataset._id, role).then(() => {
      let permissions = this.state.permissions
      permissions.push(role)
      this.setState({
        input: '',
        select: '',
        permissions: permissions,
        error: null,
      })
    })
  }

  _removeUser(userId) {
    bids.removePermission(this.props.dataset._id, userId).then(() => {
      let index
      let permissions = this.state.permissions
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i]._id === userId) {
          index = i
        }
      }
      permissions.splice(index, 1)
      this.setState({ permissions })
    })
  }
}

Share.propTypes = {
  users: PropTypes.array,
  dataset: PropTypes.object,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  location: PropTypes.object,
}

export default withRouter(Share)
