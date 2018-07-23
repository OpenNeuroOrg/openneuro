import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../config.js'

/**
 * Button starts Google oauth2 workflow
 */
const GoogleButton = ({ min }) => {
  const btnClass = min ? 'btn-blue' : 'btn-admin'
  const iconClass = min ? 'fa fa-google' : 'icon fa fa-google'
  const btnText = min ? 'Google' : 'Sign in with Google'
  return (
    <div className="login-btns">
      <a href={config.crn.url + 'auth/google'}>
        <button className={btnClass}>
          <i className={iconClass} />
          <span>{btnText}</span>
        </button>
      </a>
    </div>
  )
}

GoogleButton.propTypes = {
  min: PropTypes.bool,
}

GoogleButton.defaultProps = {
  min: false,
}

export default GoogleButton
