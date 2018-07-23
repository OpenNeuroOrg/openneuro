import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../config.js'

/**
 * Button starts Google oauth2 workflow
 */
const GlobusButton = ({ min }) => {
  const btnClass = min ? 'btn-blue' : 'btn-admin'
  const size = min ? '16' : '20'
  const btnText = min ? 'Globus' : 'Sign in with Globus'
  return (
    <div className="login-btns">
      <a href={config.crn.url + 'auth/globus'}>
        <button className={btnClass}>
          <span className="icon">
            <img
              alt="GLOBUS"
              width={size}
              height={size}
              src="https://www.globus.org/sites/all/themes/globus_bootstrap_theme/favicon.ico"
            />
          </span>
          <span>{btnText}</span>
        </button>
      </a>
    </div>
  )
}

GlobusButton.propTypes = {
  min: PropTypes.bool,
}

GlobusButton.defaultProps = {
  min: false,
}

export default GlobusButton
