import React from 'react'
import { Route, Switch } from 'react-router-dom'

// TODO - Re-enable code splitting these when we can
import Dataset from '../datalad/dataset/dataset'
import { FAQS } from '@openneuro/components'
import FrontPageContainer from './containers/front-page-container'
import Admin from '../admin/admin'
import Dashboard from '../datalad/dashboard/dashboard'
import SearchContainer from './search/search-container'
import APIKey from '../user/api.jsx'
import ErrorRoute from '../errors/errorRoute'
import PETDummy from '../pet/dummy'
import Citation from '../pages/citation-page'

const PublicDashboard = () => <Dashboard public />
const SavedDashboard = () => <Dashboard saved />

const Routes = () => (
  <Switch>
    <Route name="faq" exact path="/faq" component={FAQS} />
    <Route name="front-page" exact path="/" component={FrontPageContainer} />
    <Route name="api-key" exact path="/keygen" component={APIKey} />
    <Route name="dataset" path="/datasets" component={Dataset} />
    <Route name="search" path="/search" component={SearchContainer} />
    <Route name="admin" path="/admin" component={Admin} />
    <Route name="error" path="/error" component={ErrorRoute} />
    <Route name="pet-landing" path="/pet" component={PETDummy} />
    <Route name="citation" path="/cite" component={Citation} />
  </Switch>
)

export default Routes
