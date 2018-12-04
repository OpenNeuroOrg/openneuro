import React from 'react'
import PropTypes from 'prop-types'
import { Switch, NavLink, Redirect, Route, withRouter } from 'react-router-dom'
import DatasetQuery from './datasets/dataset-query.jsx'

const Dashboard = ({ public: isPublic }) => {
  const prefix = isPublic ? '/public' : '/dashboard'
  return (
    <div className="route-wrapper">
      <div className="fade-in inner-route clearfix">
        <div className="col-xs-12">
          <ul className="nav nav-pills tabs">
            <li>
              <NavLink to={prefix + '/datasets'} className="btn-tab">
                {isPublic ? 'Public' : 'My'} Datasets
              </NavLink>
            </li>
          </ul>
          <Switch>
            <Redirect path="/dashboard" to="/dashboard/datasets" exact />
            <Route
              name="datalad-datasets-dashboard"
              path={prefix + '/datasets'}
              component={() => <DatasetQuery public={isPublic} />}
            />
          </Switch>
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  public: PropTypes.bool,
}

export default withRouter(Dashboard)
