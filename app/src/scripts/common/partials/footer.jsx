// dependencies -------------------------------------------------------

import React from 'react'
import packageJson from '../../../../package.json'

const Footer = props => {
  let version = props.version ? props.version : packageJson.version
  return (
    <span>
      <footer>
        <div className="row">
          <div className="col-xs-12 col-md-4 version">
            <span>OpenNeuro Beta v{version}</span>
          </div>
          <div className="col-xs-12 col-md-4 footer-menu" />
          <div className="col-xs-12 col-md-4 copy">
            <span>
              &copy; 2017 Stanford Center for Reproducible Neuroscience
            </span>
          </div>
        </div>
      </footer>
    </span>
  )
}

Footer.propTypes = {
  version: React.PropTypes.string,
}

export default Footer
