// dependencies -------------------------------------------------------

import React from "react"
import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import Users from "./users"
import FlaggedFiles from "./flagged-files.jsx"
import AdminUser from "../../authentication/admin-user.jsx"

class Dashboard extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    return (
      <AdminUser>
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
                  <NavLink to="/admin/flagged-files" className="btn-tab">
                    Flagged Files
                  </NavLink>
                </li>
              </ul>
              <Routes>
                <Route path="/users" element={<Users />} />
                <Route path="/flagged-files" element={<FlaggedFiles />} />
                <Route
                  path="/"
                  element={<Navigate to="/admin/users" replace />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </AdminUser>
    )
  }
}

export default Dashboard
