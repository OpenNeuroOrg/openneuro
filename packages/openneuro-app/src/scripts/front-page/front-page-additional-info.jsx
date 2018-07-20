import React from 'react'
import Collaborators from './front-page-collaborators.jsx'
import Support from './front-page-support.jsx'
import { frontPage } from 'openneuro-content'

const AdditionalInfo = () => (
  <div className="more-info">
    <div className="container">
      {frontPage.collaborators ? <Collaborators /> : null}
      {frontPage.support ? <Support /> : null}
    </div>
  </div>
)

export default AdditionalInfo
