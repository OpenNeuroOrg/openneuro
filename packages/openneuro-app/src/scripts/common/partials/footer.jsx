// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import packageJson from '../../../../package.json'
import configurables from '../../front-page/front-page-config'

const Footer = props => {
  let version = props.version ? props.version : packageJson.version
  return (
    <span>
      <footer>
        <div className="row">
          <div className="col-xs-12 col-md-4 version">
            <span>OpenNeuro v{version}</span>
          </div>
          <div className="col-xs-12 col-md-4 privacy-policy">
            <span>
              <a href={configurables.titlePanel.privacyLink}>
                {configurables.pageTitle}&#39;s privacy policy
              </a>
            </span>
          </div>
          <div className="col-xs-12 col-md-4 copy">
            <span>
              &copy; {configurables.copyright.year}{' '}
              {configurables.copyright.holder}
            </span>
          </div>
        </div>
      </footer>
    </span>
  )
}

Footer.propTypes = {
  version: PropTypes.string,
}

export default Footer
