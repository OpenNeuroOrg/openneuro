// dependencies -------------------------------------------------------

import React from 'react'
import { Redirect, Switch, Route, Link } from 'react-router-dom'
import Users from './admin.users.jsx'
import Blacklist from './admin.blacklist.jsx'
import AppDefinitions from './admin.apps.jsx'
import EventLogs from './admin.logs.jsx'
import Datasets from '../dashboard/dashboard.datasets.jsx'
import Jobs from '../dashboard/dashboard.jobs.jsx'
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
              <Link to="/admin/users" className="btn-tab">
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/blacklist" className="btn-tab">
                Blocked Users
              </Link>
            </li>
            <li>
              <Link to="/admin/app-definitions" className="btn-tab">
                App Definitions
              </Link>
            </li>
            <li>
              <Link to="/admin/event-logs" className="btn-tab">
                Event Logs
              </Link>
            </li>
            <li>
              <Link to="/admin/datasets" className="btn-tab">
                All Datasets
              </Link>
            </li>
            <li>
              <Link to="/admin/jobs" className="btn-tab">
                All Jobs
              </Link>
            </li>
          </ul>
          <Switch>
            <Redirect
              name="defaultPath"
              path="/admin"
              to="/admin/users"
              exact
            />
            <Route name="users" path="/admin/users" exact component={Users} />
            <Route
              name="blacklist"
              path="/admin/blacklist"
              exact
              component={Blacklist}
            />
            <Route
              name="app-definitions"
              path="/admin/app-definitions"
              exact
              component={AppDefinitions}
            />
            <Route
              name="event-logs"
              path="/admin/event-logs"
              exact
              component={EventLogs}
            />
            <Route
              name="admin-datasets"
              path="/admin/datasets"
              exact
              component={Datasets}
            />
            <Route
              name="admin-jobs"
              path="/admin/jobs"
              exact
              component={Jobs}
            />
          </Switch>
        </div>
        <BlacklistModal />
      </div>
    )
  }
}

export default Dashboard
