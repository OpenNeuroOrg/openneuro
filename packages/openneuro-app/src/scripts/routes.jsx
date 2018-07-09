// dependencies ----------------------------------------------------------
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from 'loadable-components'

// wrap with loadable HOC
const Dataset = loadable(() => import('./dataset/dataset.jsx'))
const FrontPage = loadable(() => import('./front-page/front-page.jsx'))
const Admin = loadable(() => import('./admin/admin.jsx'))
const Dashboard = loadable(() => import('./dashboard/dashboard.jsx'))
const Faq = loadable(() => import('./faq/faq.jsx'))
const SearchResults = loadable(() =>
  import('./dashboard/dashboard.searchresults.jsx'),
)
const APIKey = loadable(() => import('./user/api.jsx'))

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
  </Switch>
)

export default appRoutes
