// dependencies ------------------------------------------------------------------
import React from 'react'
import PropTypes from 'prop-types'
import bowser from 'bowser'

import chrome from './assets/chrome.jpg'
import warning from './assets/warning.jpg'

export default class Happybrowser extends React.Component {
  // life cycle methods ------------------------------------------------------------
  constructor(props) {
    super(props)
    this.state = {
      hbVisible: this._incompatibleBrowser(props.ua),
    }
  }

  render() {
    if (this.state.hbVisible) {
      return (
        <div className="happybrowser-markup">
          <div className="hb-wrap clearfix">
            <div className="hb-text clearfix">
              <img src={warning} alt="warning" />
              <p>
                We have detected that you are using an incompatible browser.
                This site may not work as expected.{' '}
                <strong>
                  <a href="http://www.google.com/chrome/">
                    Please consider using a minimum of Chrome V49.0 or Firefox
                    V50.0 as your browser
                  </a>
                  .
                </strong>
              </p>
            </div>
            <div className="hb-upgrade clearfix">
              <div
                className="hb-img-wrap hb-dismiss"
                id="dismiss"
                onClick={this._dismiss.bind(this)}>
                X
              </div>
              <div className="hb-img-wrap hb-chrome">
                <a href="http://www.google.com/chrome/">
                  <img src={chrome} alt="upgrade chrome" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  _incompatibleBrowser(ua) {
    return !bowser.check(
      { chrome: '40', chromium: '40', googlebot: '0', firefox: '50' },
      true,
      ua || window.navigator.userAgent,
    )
  }

  _dismiss() {
    let self = this
    self.setState({ hbVisible: false })
  }
}

Happybrowser.propTypes = {
  ua: PropTypes.string,
}
