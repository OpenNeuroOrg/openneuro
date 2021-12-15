/**
 * Route for nice display of backend errors
 */
import React from 'react'
import { Route } from 'react-router-dom'
import OrcidGeneral from './orcid/general.jsx'
import OrcidEmail from './orcid/email.jsx'
import OrcidGiven from './orcid/given.jsx'
import OrcidFamily from './orcid/family.jsx'

class ErrorRoute extends React.Component {
  render() {
    return (
      <div className="container errors">
        <div className="panel">
          <Route path="/error/orcid" component={OrcidGeneral} />
          <Route exact path="/error/orcid/email" component={OrcidEmail} />
          <Route exact path="/error/orcid/given" component={OrcidGiven} />
          <Route exact path="/error/orcid/family" component={OrcidFamily} />
        </div>
      </div>
    )
  }
}

export default ErrorRoute
