// dependencies -------------------------------------------------------

import React from 'react'
import { Redirect, Switch, Route, NavLink } from 'react-router-dom'
import Users from './admin.users.jsx'
import Blacklist from './admin.blacklist.jsx'
import AppDefinitions from './admin.apps.jsx'
import EventLogs from './admin.logs.jsx'
import Graphs from '../admin/admin.graphs.jsx'
//import Datasets from '../dashboard/dashboard.datasets.jsx'

import BlacklistModal from './admin.blacklist.modal.jsx'
import actions from './admin.actions'
import config from '../../../config'
import { JobAppDefinitionsLink } from '../common/partials/jobs.jsx'
import LoggedIn from '../authentication/logged-in.jsx'

const analysisEnabled = !!config.analysis.enabled

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
      <LoggedIn>
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
                  <JobAppDefinitionsLink enabled={analysisEnabled} />
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
              </ul>
              <Switch>
                <Redirect
                  name="defaultPath"
                  path="/admin"
                  to="/admin/users"
                  exact
                />
                <Route
                  name="users"
                  path="/admin/users"
                  exact
                  component={Users}
                />
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
                  render={() => null /*<Datasets admin {...props} />*/}
                />
                <Route
                  name="admin-jobs-stats"
                  path="/admin/job-statistics"
                  exact
                  component={Graphs}
                />
              </Switch>
            </div>
            <BlacklistModal />
          </div>
        </div>
      </LoggedIn>
    )
  }
}

export default Dashboard
