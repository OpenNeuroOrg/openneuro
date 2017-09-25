// dependencies -------------------------------------------------------

import React from 'react'
import { RouteHandler, Link } from 'react-router'
import BlacklistModal from './admin.blacklist.modal.jsx'
import actions from './admin.actions'

class Dashboard extends React.Component {
  // life cycle events --------------------------------------------------

  componentDidMount() {
    actions.getBlacklist()
    actions.getUsers()
    actions.update({ showBlacklistModal: false })
    actions.getEventLogs()
  }

  render() {
    return (
      <div className="inner-route clearfix">
        <div className="col-xs-12">
          <ul className="nav nav-pills tabs">
            <li>
              <Link to="users" className="btn-tab">
                Users
              </Link>
            </li>
            <li>
              <Link to="blacklist" className="btn-tab">
                Blocked Users
              </Link>
            </li>
            <li>
              <Link to="app-definitions" className="btn-tab">
                App Definitions
              </Link>
            </li>
            <li>
              <Link to="event-logs" className="btn-tab">
                Event Logs
              </Link>
            </li>
            <li>
              <Link to="admin-datasets" className="btn-tab">
                All Datasets
              </Link>
            </li>
            <li>
              <Link to="admin-jobs" className="btn-tab">
                All Jobs
              </Link>
            </li>
                <li>
              <Link to="progression" className="btn-tab">
                Progression
              </Link>
            </li>
          </ul>
          <RouteHandler />
        </div>
        <BlacklistModal />
      </div>
    )
  }
}

export default Dashboard
