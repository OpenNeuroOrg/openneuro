import React from 'react'
import PropTypes from 'prop-types'
import GoogleButton from './google-button.jsx'
import OrcidButton from './orcid-button.jsx'
import GlobusButton from './globus-button.jsx'
import config from '../../../config'

/**
 * get config flags for each auth mechanism
 */
const googleConfigured = config.auth.google.clientID
const orcidConfigured = config.auth.orcid.clientID
const globusConfigured = config.auth.globus.clientID

/**
 * Display a button for each enabled authentication mechanism
 */

const AuthenticationButtons = ({ min }) => {
  return (
    <span>
      {googleConfigured ? <GoogleButton min={min} /> : null}
      {globusConfigured ? <GlobusButton min={min} /> : null}
      {orcidConfigured ? <OrcidButton min={min} /> : null}
    </span>
  )
}

AuthenticationButtons.propTypes = {
  min: PropTypes.bool,
}

export default AuthenticationButtons
