import React from 'react'

const OrcidButton = () => (
  <button className="btn-admin" onClick={userStore.orcidSignIn}>
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
)

export default OrcidButton
