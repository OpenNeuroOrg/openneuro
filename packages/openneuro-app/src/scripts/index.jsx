// dependencies --------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import Navbar from './nav/navbar.jsx'
import Happybrowser from './common/partials/happybrowser.jsx'
import Routes from './routes.jsx'
import Alert from './notification/notification.alert.jsx'
import Uploader from './uploader/uploader.jsx'
import notificationStore from './notification/notification.store'
import { refluxConnect } from './utils/reflux'

class Index extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, notificationStore, 'notification')
  }

  // life cycle methods --------------------------------------------------------
  render() {
    let alertState = this.state.notification.showAlert
    return (
      <Uploader>
        <div className="page">
          <Happybrowser />
          <span className={'nav-alert-state-' + alertState}>
            <Alert />
          </span>
          <div className={'main-parent alert-state-' + alertState}>
            <Navbar />
            <div className="main view container">
              <Routes />
            </div>
          </div>
        </div>
      </Uploader>
    )
  }
}

export default Index
