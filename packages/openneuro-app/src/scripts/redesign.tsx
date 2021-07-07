import React from 'react'
import Uploader from './uploader/uploader.jsx'
import Routes_REFACTOR from './refactor_2021/routes'
import HeaderContainer from './refactor_2021/containers/header'
import { SearchParamsProvider } from './refactor_2021/search/search-params-ctx'
import { UserModalParamsProvider } from './refactor_2021/user-login-modal-ctx'

const Redesign = (): React.ReactElement => {
  import('@openneuro/components/page/page.scss')
  return (
    <Uploader>
      <SearchParamsProvider>
        <UserModalParamsProvider>
          <HeaderContainer />
          <Routes_REFACTOR />
        </UserModalParamsProvider>
      </SearchParamsProvider>
    </Uploader>
  )
}

export default Redesign
