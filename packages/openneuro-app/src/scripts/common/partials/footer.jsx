// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { version as openneuroVersion } from '../../../lerna.json'
import { frontPage } from '../../front-page/front-page-content.js'

const Footer = props => {
  const version = props.version ? props.version : openneuroVersion
  return (
    <span>
      <footer>
        <div className="row">
          <div className="col-xs-12 col-md-4 version">
            <span>OpenNeuro v{version}</span>
          </div>
          <div className="col-xs-12 col-md-4 privacy-policy">
            <span>
              <a href={frontPage.titlePanel.privacyLink}>
                {frontPage.pageTitle}
                &#39;s Privacy Policy
              </a>
            </span>
          </div>
          <div className="col-xs-12 col-md-4 copy">
            <span>
              &copy; {new Date().getFullYear()} {frontPage.copyright.holder}
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
