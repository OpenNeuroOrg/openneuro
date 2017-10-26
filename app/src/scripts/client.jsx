// dependencies ---------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'

ReactDOM.render(
  <Router>
    <Route component={analyticsWrapper(Index)} />
  </Router>,
  document.getElementById('main'),
)
