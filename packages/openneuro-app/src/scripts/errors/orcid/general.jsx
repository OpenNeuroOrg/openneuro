import React from "react"

const OrcidError = () => (
  <div className="panel-heading">
    <h2>There was an issue authenticating with your ORCID account.</h2>
    <p>
      This may be a temporary issue, please try again later. Ensure that your
      ORCID profile has one email address available to OpenNeuro following{" "}
      <a href="https://docs.openneuro.org/orcid.html#enabling-trusted-access-to-emails">
        our documentation
      </a>{" "}
      and try again.
    </p>
    <p>
      If this issue persists, please contact support and include the ORCID
      account you're attempting to login with.
    </p>
  </div>
)

export default OrcidError
