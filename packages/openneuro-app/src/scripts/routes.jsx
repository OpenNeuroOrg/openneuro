// dependencies ----------------------------------------------------------
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from 'loadable-components'
import Dataset from './dataset/dataset.jsx'
import LoggedIn from './authentication/logged-in.jsx'

// const datasetComponent = config.datalad.enabled ? DataLad : Dataset
const datasetComponent = Dataset

// wrap with loadable HOC
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
    <LoggedIn>
      <Route name="dashboard" path="/dashboard" component={Dashboard} />
    </LoggedIn>
    <Route name="public" path="/public" component={PublicDashboard} />
    <LoggedIn>
      <Route name="admin" path="/admin" component={Admin} />
    </LoggedIn>
    <Route name="dataset" path="/datasets" component={datasetComponent} />
    <Route name="search" path="/search/:query?" component={SearchResults} />
  </Switch>
)

export default appRoutes
