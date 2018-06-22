import React from 'react'
import config from '../../../config.js'

/**
 * Button starts Google oauth2 workflow
 */
const GoogleButton = () => (
  <a href={config.crn.url + '/auth/google'}>
    <button className="btn-admin">
      <i className="icon fa fa-google" />
      Sign in with Google
    </button>
  </a>
)

export default GoogleButton
