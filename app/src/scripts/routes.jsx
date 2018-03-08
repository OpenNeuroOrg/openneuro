// dependencies ----------------------------------------------------------

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from 'loadable-components'
import requireAuth from './utils/requireAuth'

// wrap with loadable HOC
const FrontPage = loadable(() => import('./front-page/front-page.jsx'))
const Admin = loadable(() => import('./admin/admin.jsx'))
const Dashboard = loadable(() => import('./dashboard/dashboard.jsx'))
const Dataset = loadable(() => import('./dataset/dataset.jsx'))
const Faq = loadable(() => import('./faq/faq.jsx'))
const SearchResults = loadable(() =>
  import('./dashboard/dashboard.searchresults.jsx'),
)

// routes ----------------------------------------------------------------

const PublicDashboard = () => <Dashboard public />

const appRoutes = () => (
  <Switch>
    <Route name="front-page" exact path="/" component={FrontPage} />
    <Route name="faq" exact path="/faq" component={Faq} />
    <Route
      name="dashboard"
      path="/dashboard"
      component={requireAuth(Dashboard)}
    />
    <Route name="public" path="/public" component={PublicDashboard} />
    <Route name="admin" path="/admin" component={requireAuth(Admin, 'admin')} />
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
    <Route name="search" path="/search/:query" component={SearchResults} />
  </Switch>
)

export default appRoutes
