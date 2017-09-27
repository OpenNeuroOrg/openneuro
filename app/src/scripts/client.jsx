// dependencies ---------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  browserHistory,
} from 'react-router-dom'
import Routes from './routes.jsx'
import analyticsWrapper from './utils/analytics.js'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={analyticsWrapper(Routes)} />
  </Router>,
  document.getElementById('main'),
)
