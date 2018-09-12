import React from 'react'

const FamilyError = () => (
  <div className="panel-body">
    Your ORCID account does not have a credit name or family name, or your name
    is not public. Visit your{' '}
    <a href="https://orcid.org/my-orcid">ORCID profile</a> and verify verify you
    have a publicly available name set.
  </div>
)

export default FamilyError
