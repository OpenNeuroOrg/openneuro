import React from 'react'

const GivenError = () => (
  <div className="panel-body">
    Your ORCID account does not have a credit name or given name, or your name
    is not public. Visit your{' '}
    <a href="https://orcid.org/my-orcid">ORCID profile</a> and verify you have a
    publicly available name set.
  </div>
)

export default GivenError
