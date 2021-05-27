// dependencies --------------------------------------------------------------

import React from 'react'
import Navbar from './nav/navbar.jsx'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'
import FeatureToggle from './components/feature-toggle'

const Index = () => {
  return (
    <FeatureToggle
      feature="redesign_2021"
      renderOnEnabled={() => <h1>Redesign 2021</h1>}
      renderOnDisabled={() => (
        <Uploader>
          <div className="page">
            <div className="main">
              <Navbar />
              <Routes />
            </div>
          </div>
        </Uploader>
      )}
    />
  )
}

export default Index
