import React from 'react'
import Collaborators from './front-page-collaborators.jsx'
import Support from './front-page-support.jsx'
import configurables from './front-page-config'

const AdditionalInfo = () => (
  <div className="more-info">
    <div className="container">
      {configurables.collaborators ? <Collaborators /> : null}
      {configurables.support ? <Support /> : null}
    </div>
  </div>
)

export default AdditionalInfo
