// dependencies ---------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router'
import routes from './routes.jsx'
import RouterContainer from './utils/router-container'
import config from '../../config'
import ReactGA from 'react-ga'

if (config.analytics.trackingId) {
  //Google analytics
  ReactGA.initialize(config.analytics.trackingId)

  Router.HistoryLocation.addChangeListener(e => {
    let path = e.path
    ReactGA.ga('send', 'pageview', path)
  })
}
// intialize router -----------------------------------------------------

let router = Router.create({ routes: routes, location: Router.HistoryLocation })

RouterContainer.set(router)

Router.run(routes, Router.HistoryLocation, function(Handler) {
  ReactDOM.render(<Handler />, document.getElementById('main'))
})
