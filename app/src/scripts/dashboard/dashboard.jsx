// dependencies -------------------------------------------------------

import React from 'react'
import { withRouter } from 'react-router'
import { RouteHandler, Link } from 'react-router-dom'

class Dashboard extends React.Component {
  render() {
    let isPublic = this.props.location.pathname.indexOf('dashboard') === -1
    return (
      <div className="fade-in inner-route clearfix">
        <div className="col-xs-12">
          <ul className="nav nav-pills tabs">
            <li>
              <Link
                to={isPublic ? 'publicDatasets' : 'datasets'}
                className="btn-tab">
                {isPublic ? 'Public' : 'My'} Datasets
              </Link>
            </li>
            <li>
              <Link to={isPublic ? 'publicJobs' : 'jobs'} className="btn-tab">
                {isPublic ? 'Public' : 'My'} Analyses
              </Link>
            </li>
          </ul>
          {/*<RouteHandler /> TODO */}
        </div>
      </div>
    )
  }
}

export default withRouter(Dashboard)
