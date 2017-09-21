// dependencies ----------------------------------------------------------

import React from 'react'
import {
  BrowserRouter as Router,
  browserHistory,
  Route,
  Switch,
} from 'react-router-dom'
import requireAuth from './utils/requireAuth'

// views
import FrontPage from './front-page/front-page.jsx'
import Admin from './admin/admin.jsx'
import Dashboard from './dashboard/dashboard.jsx'
import Dataset from './dataset/dataset.jsx'
import Faq from './faq/faq.jsx'

// routes ----------------------------------------------------------------

const appRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route name="front-page" exact path="/" component={FrontPage} />
      <Route name="faq" exact path="/faq" component={Faq} />
      <Route
        name="dashboard"
        exact
        path="/dashboard"
        component={requireAuth(Dashboard)}
      />
      <Route
        name="admin"
        exact
        path="/admin"
        component={requireAuth(Admin, 'admin')}
      />
      <Route
        name="dataset"
        exact
        path="/datasets/:datasetId"
        component={Dataset}
      />
      <Route
        name="snapshot"
        exact
        path="/datasets/:datasetId/versions/:snapshotId"
        component={Dataset}
      />
    </Switch>
  </Router>
)

export default appRoutes
