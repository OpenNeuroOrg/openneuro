// dependencies ----------------------------------------------------------
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from 'loadable-components'

// wrap with loadable HOC
const Dataset = loadable(() =>
  import(/* webpackChunkName: 'Dataset' */ './dataset/dataset.jsx'),
)
const FrontPage = loadable(() =>
  import(/* webpackChunkName: 'FrontPage' */ './front-page/front-page.jsx'),
)
const Admin = loadable(() =>
  import(/* webpackChunkName: 'Admin' */ './admin/admin.jsx'),
)
const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ './datalad/dashboard/datalad.dashboard.jsx'),
)
const Faq = loadable(() =>
  import(/* webpackChunkName: 'Faq' */ './faq/faq.jsx'),
)
const SearchResults = loadable(() =>
  import(/* webpackChunkName: 'SearchResults' */ './dashboard/dashboard.searchresults.jsx'),
)
const APIKey = loadable(() =>
  import(/* webpackChunkName: 'APIKey' */ './user/api.jsx'),
)
const ErrorRoute = loadable(() =>
  import(/* webpackChunkName: 'Errors' */ './errors/errorRoute.jsx'),
)
const PETDummy = loadable(() =>
  import(/* webpackChunkName: 'PET' */ './pet/dummy.jsx'),
)

// routes ----------------------------------------------------------------

const PublicDashboard = () => <Dashboard public />

const appRoutes = () => (
  <Switch>
    <Route name="front-page" exact path="/" component={FrontPage} />
    <Route name="faq" exact path="/faq" component={Faq} />
    <Route name="api-key" exact path="/keygen" component={APIKey} />
    <Route name="dashboard" path="/dashboard" component={Dashboard} />
    <Route name="public" path="/public" component={PublicDashboard} />
    <Route name="dataset" path="/datasets" component={Dataset} />
    <Route name="search" path="/search/:query?" component={SearchResults} />
    <Route name="admin" path="/admin" component={Admin} />
    <Route name="error" path="/error" component={ErrorRoute} />
    <Route name="pet-landing" path="/pet" component={PETDummy} />
  </Switch>
)

export default appRoutes
