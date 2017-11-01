// dependencies ---------------------------------------------------------
import initOpbeat from 'opbeat-react'
import { wrapRouter } from 'opbeat-react'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from './index.jsx'
import analyticsWrapper from './utils/analytics.js'

initOpbeat({
  orgId: 'bafe9710d0924564ae85e865c4861460',
  appId: 'e7bc74804e'
})

const OpbeatRouter = wrapRouter(Router)

ReactDOM.render(
  <OpbeatRouter>
    <Route component={analyticsWrapper(Index)} />
  </OpbeatRouter>,
  document.getElementById('main'),
)
