// dependencies --------------------------------------------------------------

import React from 'react'
import Routes_REFACTOR from './refactor_2021/routes'
import Navbar from './nav/navbar.jsx'
import HeaderContainer from './refactor_2021/containers/header'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'
import FeatureToggle from './components/feature-toggle'

const Index = () => {
  return (
    <FeatureToggle
      feature="redesign-2021"
      renderOnEnabled={() => (
        <Uploader>
          <HeaderContainer />
          <Routes_REFACTOR />
        </Uploader>
      )}
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
