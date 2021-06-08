// dependencies --------------------------------------------------------------

import React, { Suspense, lazy } from 'react'
import Routes_REFACTOR from './refactor_2021/routes'
import Navbar from './nav/navbar.jsx'
import HeaderContainer from './refactor_2021/containers/header'
import Routes from './routes.jsx'
import Uploader from './uploader/uploader.jsx'
import FeatureToggle from './components/feature-toggle'
import { SearchParamsProvider } from './refactor_2021/search/search-params-ctx'
const MainStyles = lazy(() => import('../sass/MainStyles'))

const Index = () => {
  return (
    <FeatureToggle
      feature="redesign-2021"
      renderOnEnabled={() => (
        <Uploader>
          <SearchParamsProvider>
            <HeaderContainer />
            <Routes_REFACTOR />
          </SearchParamsProvider>
        </Uploader>
      )}
      renderOnDisabled={() => (
        <>
          <Suspense fallback={<></>}>{<MainStyles />}</Suspense>
          <Uploader>
            <div className="page">
              <div className="main">
                <Navbar />
                <Routes />
              </div>
            </div>
          </Uploader>
        </>
      )}
    />
  )
}

export default Index
