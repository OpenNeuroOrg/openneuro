// dependencies --------------------------------------------------------------

import React from 'react'
import Navbar from './nav/navbar.jsx'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'
import FeatureToggle from './components/feature-toggle'
import {
  SearchParamsProvider,
  IntermediateComponent,
  ModalitySelectContainer,
} from './refactor_2021/search/search-params-ctx'

const Index = () => {
  return (
    <FeatureToggle
      feature="redesign-2021"
      renderOnEnabled={() => (
        <>
          <h1>Redesign 2021</h1>
          <SearchParamsProvider>
            <IntermediateComponent>
              <ModalitySelectContainer />
              <ModalitySelectContainer />
            </IntermediateComponent>
          </SearchParamsProvider>
        </>
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
