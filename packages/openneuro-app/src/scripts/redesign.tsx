import React from 'react'
import Uploader from './refactor_2021/uploader/uploader.jsx'
import Routes_REFACTOR from './refactor_2021/routes'
import HeaderContainer from './refactor_2021/containers/header'
import FooterContainer from './refactor_2021/containers/footer'
import { SearchParamsProvider } from './refactor_2021/search/search-params-ctx'
import { UserModalOpenProvider } from './refactor_2021/user-login-modal-ctx'

const Redesign = (): React.ReactElement => (
  <Uploader>
    <SearchParamsProvider>
      <UserModalOpenProvider>
        <div className="sticky-content">
          <HeaderContainer />
          <Routes_REFACTOR />
        </div>
        <div className="sticky-footer">
          <FooterContainer />
        </div>
      </UserModalOpenProvider>
    </SearchParamsProvider>
  </Uploader>
)

export default Redesign
