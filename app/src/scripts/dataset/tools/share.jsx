/*eslint react/no-did-mount-set-state: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import bids from '../../utils/bids'
import Input from '../../common/forms/input.jsx'
import WarnButton from '../../common/forms/warn-button.jsx'
import Spinner from '../../common/partials/spinner.jsx'
import Timeout from '../../common/partials/timeout.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import userStore from '../../user/user.store'
import datasetStore from '../dataset.store'
import actions from '../dataset.actions'
import { refluxConnect } from '../../utils/reflux'

class Share extends Reflux.Component {
  // life cycle events --------------------------------------------------

  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
    actions.loadUsers()
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
    let datasets = this.state.datasets
    let dataset = datasets ? datasets.dataset : null

    let permissions = datasets && dataset ? dataset.permissions : null

    let users = datasets && datasets.users ? datasets.users : null

    this.setState({
      users: users,
      permissions: permissions,
    })
  }

  componentDidMount() {
    let datasets = this.state.datasets
    let dataset = datasets ? datasets.dataset : null

    let permissions = datasets && dataset ? dataset.permissions : null

    let users = datasets && datasets.users ? datasets.users : null

    this.setState({
      users: users,
      permissions: permissions,
    })
  }

  render() {
    let datasets = this.state.datasets
    let loading = datasets && datasets.loading
    let loadingText =
      datasets && typeof datasets.loading == 'string'
        ? datasets.loading
        : 'loading'
    let instruction =
      "Enter a user's email address and select access level to share"
    let returnLink = null
    if (this.state.datasets.datasetUrl) {
      returnLink = (
        <Link to={this.state.datasets.datasetUrl}>
          <button className="btn-reset">back</button>
        </Link>
      )
    }

    let content = (
      <div className="dataset-form">
        <div className="col-xs-12 dataset-form-header">
          <div className="form-group">
            <label>Share Dataset</label>
          </div>
          <hr className="modal-inner" />
          <div className="dataset-form-body col-xs-12">
            <div className="dataset-form-content col-xs-12">
              <div className="dataset share-modal">
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
                </div>
              </div>
            </div>
            <div className="dataset-form-controls col-xs-12">
              <button
                className="btn-modal-submit"
                onClick={this._addUser.bind(this)}>
                share
              </button>
              {returnLink}
            </div>
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

  // template methods ---------------------------------------------------

  _permissions(permissions) {
    let accessKey = {
      admin: 'Administrator',
      rw: 'Can edit',
      ro: 'Can view',
    }
    if (permissions) {
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
    } else {
      return null
    }
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
    bids.addPermission(this.state.datasets.dataset._id, role).then(() => {
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
    bids.removePermission(this.state.datasets.dataset._id, userId).then(() => {
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
  match: PropTypes.object,
}

export default withRouter(Share)
