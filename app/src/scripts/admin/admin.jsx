// dependencies -------------------------------------------------------

import React from 'react'
import { Redirect, Switch, Route, NavLink } from 'react-router-dom'
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
      <div className="admin route-wrapper">
        <div className="inner-route clearfix">
          <div className="col-xs-12">
            <ul className="nav nav-pills tabs">
              <li>
                <NavLink to="/admin/users" className="btn-tab">
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/blacklist" className="btn-tab">
                  Blocked Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/app-definitions" className="btn-tab">
                  App Definitions
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/event-logs" className="btn-tab">
                  Event Logs
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/datasets" className="btn-tab">
                  All Datasets
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/jobs" className="btn-tab">
                  All Jobs
                </NavLink>
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
      </div>
    )
  }
}

export default Dashboard
