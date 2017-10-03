// dependencies --------------------------------------------------------------

import React from 'react'
import Navbar from './nav/navbar.jsx'
import Happybrowser from './common/partials/happybrowser.jsx'
import Routes from './routes.jsx'
import Alert from './notification/notification.alert.jsx'
import notificationStore from './notification/notification.store'
import { refluxConnect } from './utils/reflux'

import 'babel-polyfill'

class App extends React.Component {
  constructor() {
    super()
    refluxConnect(self, notificationStore, 'notification')
  }

  // life cycle methods --------------------------------------------------------
  render() {
    let alertState = this.state.notification.showAlert
    // TODO - restore page class names...
    return (
      <span>
        <div className="page">
          <Happybrowser />
          <span className={'nav-alert-state-' + alertState}>
            <Alert />
          </span>
          <div className={'full-col alert-state-' + alertState}>
            <Navbar />
            <div className="main view container">
              <Routes />
            </div>
          </div>
        </div>
      </span>
    )
  }
}

export default App
