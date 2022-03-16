import React from 'react'
import Uploader from './uploader/uploader.jsx'
import Routes from './routes'
import HeaderContainer from './common/containers/header'
import FooterContainer from './common/containers/footer'
import { SearchParamsProvider } from './search/search-params-ctx'
import { UserModalOpenProvider } from './utils/user-login-modal-ctx'

import '../assets/email-header.png'

const Index = (): React.ReactElement => (
  <Uploader>
    <SearchParamsProvider>
      <UserModalOpenProvider>
        <div className="sticky-content">
          <HeaderContainer />
          <Routes />
        </div>
        <div className="sticky-footer">
          <FooterContainer />
        </div>
      </UserModalOpenProvider>
    </SearchParamsProvider>
  </Uploader>
)

export default Index
