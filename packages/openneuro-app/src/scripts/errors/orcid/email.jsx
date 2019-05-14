import React from 'react'

const EmailError = () => (
  <div className="panel-body">
    Your ORCID account does not have an e-mail, or your e-mail is not public.
    Visit your <a href="https://orcid.org/my-orcid">ORCID profile</a> and verify
    you have a public e-mail address and try again.
  </div>
)

export default EmailError
