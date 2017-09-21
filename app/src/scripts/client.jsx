// dependencies ---------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import Routes from './routes.jsx'
import analyticsWrapper from './utils/analytics.js'

ReactDOM.render(
  <Route component={analyticsWrapper(Routes)} />,
  document.getElementById('main'),
)
