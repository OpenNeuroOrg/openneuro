import React from 'react'
import GoogleButton from './google-button.jsx'
import OrcidButton from './orcid-button.jsx'
import config from '../../../config'

/**
 * get config flags for each auth mechanism
 */
const googleConfigured = config.auth.google.clientID
const orcidConfigured = config.auth.orcid.clientID

/**
 * Display a button for each enabled authentication mechanism
 */

const AuthenticationButtons = () => {
  return (
    <span>
      {googleConfigured ? <GoogleButton /> : null}
      {orcidConfigured ? <OrcidButton /> : null}
    </span>
  )
}

export default AuthenticationButtons
