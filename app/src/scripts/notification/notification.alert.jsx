// dependencies ------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import { Alert } from 'react-bootstrap'
import Wrapper from '../common/partials/wrapper.jsx'
import notificationStore from './notification.store'
import actions from './notification.actions'
import { refluxConnect } from '../utils/reflux'

// component setup ---------------------------------------------------------------

class alert extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, notificationStore, 'notification')
  }

  // life cycle methods ------------------------------------------------------------

  render() {
    let type = this.state.notification.alertType
    let bsStyle
    if (type === 'Warning') {
      bsStyle = 'warning'
    }
    if (type === 'Error') {
      bsStyle = 'danger'
    }
    if (type === 'Success') {
      bsStyle = 'success'
    }

    let alert = (
      <Alert className="clearfix" bsStyle={bsStyle}>
        <Wrapper>
          <div className="wrapper">
            <div className="alert-left">
              <strong>{type}! </strong>
              {this.state.notification.alertMessage}
            </div>
            <button
              className="alert-right dismiss-button-x"
              onClick={actions.closeAlert}>
              <i className="fa fa-times" />
            </button>
          </div>
        </Wrapper>
      </Alert>
    )

    return this.state.notification.showAlert ? alert : false
  }
}

export default alert
