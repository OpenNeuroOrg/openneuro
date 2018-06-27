// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import adminStore from './admin.store'
import actions from './admin.actions'
import WarnButton from '../common/forms/warn-button.jsx'
import { refluxConnect } from '../utils/reflux'

class Blacklist extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, adminStore, 'admin')
  }

  // life cycle events --------------------------------------------------

  render() {
    let noBlacklist = (
      <div className="no-results">There are no blocked users</div>
    )
    let users = this.state.admin.blacklist.map(user => {
      let userEmail = user.hasOwnProperty('email') ? user.email : user._id
      return (
        <div className="fade-in user-panel clearfix" key={user._id}>
          <div className="col-xs-5 user-col">
            <h3>
              <div className="userName">
                <span>{user.name}</span>
              </div>
            </h3>
            <h3 className="user-email">{userEmail}</h3>
          </div>
          <div className="col-xs-4 user-col">
            <div>{user.note}</div>
          </div>
          <div className="col-xs-3 last dataset-tools-wrap-admin">
            <div className="tools clearfix">
              <div className="tool">
                <WarnButton
                  message="Unblock User"
                  action={actions.unBlacklistUser.bind(this, user._id)}
                />
              </div>
            </div>
          </div>
        </div>
      )
    })

    return (
      <div className="admin blacklist">
        <div className="dashboard-dataset-teasers fade-in admin-blacklist clearfix">
          <h2>Blocked Users</h2>
          <button className="btn-blue" onClick={actions.blacklistModal}>
            <span>Block a User</span>
          </button>
          <div>
            <div className="col-xs-12 users-panel-wrap ">
              <div className="fade-in user-panel-header clearfix">
                <div className="col-xs-5 user-col">
                  <label>User</label>
                </div>
                <div className="col-xs-4 user-col">
                  <label>Notes</label>
                </div>
                <div className="col-xs-3 user-col">
                  <label>Actions</label>
                </div>
              </div>
              {this.state.admin.blacklist.length == 0 ? noBlacklist : users}
            </div>
          </div>
        </div>
      </div>
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
}

export default Blacklist
