import React from 'react'
import config from '../../../config'

const OrcidButton = () => (
  <a href={config.crn.url + 'auth/orcid'}>
    <button className="btn-admin">
      <span className="icon">
        <img
          alt="ORCID"
          width="20"
          height="20"
          src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
        />
      </span>
      Sign in with ORCID
    </button>
  </a>
)

export default OrcidButton
