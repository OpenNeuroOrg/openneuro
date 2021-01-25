// dependencies -------------------------------------------------------

import React from 'react'
import { Redirect, Switch, Route, NavLink } from 'react-router-dom'
import Users from './users.jsx'
import Exports from './exports.jsx'
import LoggedIn from '../authentication/logged-in.jsx'

class Dashboard extends React.Component {
  // life cycle events --------------------------------------------------

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
                  <NavLink to="/admin/exports" className="btn-tab">
                    Exports
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
                  name="users"
                  path="/admin/exports"
                  exact
                  component={Exports}
                />
              </Switch>
            </div>
          </div>
        </div>
      </LoggedIn>
    )
  }
}

export default Dashboard
