import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

// TODO - Re-enable code splitting these when we can
import Dataset from './dataset/draft-snapshot-routes'
//import PreRefactorDatasetProps from './dataset/dataset-pre-refactor-container'

import { FAQS } from '@openneuro/components/faqs'
import FrontPageContainer from './containers/front-page-container'
import Admin from './admin/admin'
import SearchRoutes from './search/search-routes'
import APIKey from './user/api'
import ErrorRoute from '../errors/errorRoute'
import { PETRedirect } from '../pet/redirect'
import Citation from '../pages/citation-page'
import FourOFourPage from '../errors/404page'
import { ImportDataset } from '../pages/import-dataset'

const Routes: React.VoidFunctionComponent = () => (
  <Switch>
    <Route exact path="/faq" component={FAQS} />
    <Route exact path="/" component={FrontPageContainer} />
    <Route exact path="/keygen" component={APIKey} />
    <Route path="/datasets" component={Dataset} />
    <Route path="/search" component={SearchRoutes} />
    <Route path="/admin" component={Admin} />
    <Route path="/error" component={ErrorRoute} />
    <Route path="/pet" component={PETRedirect} />
    <Route path="/cite" component={Citation} />
    <Route path="/import" component={ImportDataset} />
    <Redirect from="/public" to="/search" />
    <Redirect from="/saved" to="/search?bookmarks" />
    <Redirect from="/dashboard" to="/search?mydatasets" />
    <Route component={FourOFourPage} />
  </Switch>
)

export default Routes
