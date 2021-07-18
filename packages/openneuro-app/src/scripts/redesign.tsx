import React from 'react'
import Uploader from './uploader/uploader.jsx'
import Routes_REFACTOR from './refactor_2021/routes'
import HeaderContainer from './refactor_2021/containers/header'
import { SearchParamsProvider } from './refactor_2021/search/search-params-ctx'
import { UserModalOpenProvider } from './refactor_2021/user-login-modal-ctx'

const Redesign = (): React.ReactElement => (
  <Uploader>
    <SearchParamsProvider>
      <UserModalOpenProvider>
        <HeaderContainer />
        <Routes_REFACTOR />
      </UserModalOpenProvider>
    </SearchParamsProvider>
  </Uploader>
)

export default Redesign
