/**
 * Route for nice display of backend errors
 */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import OrcidGeneral from './orcid/general.jsx'
import OrcidEmail from './orcid/email.jsx'
import OrcidGiven from './orcid/given.jsx'
import OrcidFamily from './orcid/family.jsx'

class ErrorRoute extends React.Component {
  render() {
    return (
      <div className="container errors">
        <div className="panel">
          <Route
            name="orcidError"
            path="/error/orcid"
            component={OrcidGeneral}
          />
          <Route
            name="email"
            exact
            path="/error/orcid/email"
            component={OrcidEmail}
          />
          <Route
            name="given"
            exact
            path="/error/orcid/given"
            component={OrcidGiven}
          />
          <Route
            name="family"
            exact
            path="/error/orcid/family"
            component={OrcidFamily}
          />
        </div>
      </div>
    )
  }
}

export default ErrorRoute
