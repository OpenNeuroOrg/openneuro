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
    return (
      <div
        className={
          this.state.hbVisible
            ? 'happybrowser-markup'
            : 'happybrowser-markup hidden'
        }>
        <div className="hb-wrap clearfix">
          <div className="hb-text clearfix">
            <img src={warning} alt="warning" />
            <p>
              We have detected that you are using an incompatible browser. This
              site may not work as expected.{' '}
              <strong>
                <a href="http://www.google.com/chrome/">
                  Please consider using Chrome, V49.0 or higher, as your browser
                </a>.
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
  }

  _incompatibleBrowser(ua) {
    let check = bowser.check(
      { chrome: '49', chromium: '49', googlebot: '0' },
      true,
      ua || window.navigator.userAgent,
    )
    return !check
  }

  _dismiss() {
    let self = this
    self.setState({ hbVisible: false })
  }
}

Happybrowser.propTypes = {
  ua: PropTypes.string,
}
