import React from 'react'
import PropTypes from 'prop-types'
import GoogleButton from './google-button.jsx'
import OrcidButton from './orcid-button.jsx'
import GlobusButton from './globus-button.jsx'
import config from '../../../config'

/**
 * Display a button for each enabled authentication mechanism
 */

const AuthenticationButtons = ({ min }) => {
  return (
    <span>
      {config.auth.google.clientID ? <GoogleButton min={min} /> : null}
      {config.auth.globus.clientID ? <GlobusButton min={min} /> : null}
      {config.auth.orcid.clientID ? <OrcidButton min={min} /> : null}
    </span>
  )
}

AuthenticationButtons.propTypes = {
  min: PropTypes.bool,
}

export default AuthenticationButtons
