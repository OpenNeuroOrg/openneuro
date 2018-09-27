import React from 'react'
import { Switch, NavLink, Redirect, Route, withRouter } from 'react-router-dom'
import DataladDashboardDatasets from './datasets/datalad.dashboard.datasets.jsx'
// import DataladDashboardJobs from './jobs/datalad.dashboard.jobs.jsx'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    const isPublic = props.location.pathname.indexOf('public') > -1
    this.state = {
      public: isPublic,
    }
  }

  render() {
    let prefix = this.state.public ? '/public' : '/dashboard'
    console.log('this.props:', this.props)
    return (
      <div className="route-wrapper">
        <div className="fade-in inner-route clearfix">
          <div className="col-xs-12">
            <ul className="nav nav-pills tabs">
              <li>
                <NavLink to={prefix + '/datasets'} className="btn-tab">
                  {this.state.public ? 'Public' : 'My'} Datasets
                </NavLink>
              </li>
              <li>
                {/* <JobLink
                  prefix={prefix}
                  isPublic={isPublic}
                  enabled={analysisEnabled}
                /> */}
              </li>
            </ul>
            <Switch>
              <Redirect path="/dashboard" to="/dashboard/datasets" exact />
              <Route
                name="datalad-datasets-dashboard"
                path={prefix + '/datasets'}
                component={DataladDashboardDatasets}
              />
              {/* <Route
                name="datalad-jobs-dashboard"
                path="/dashboard/jobs"
                component={DataladDashboardJobs}
            /> */}
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Dashboard)
