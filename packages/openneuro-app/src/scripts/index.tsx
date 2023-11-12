import React from "react"
import Uploader from "./uploader/uploader.jsx"
import AppRoutes from "./routes"
import HeaderContainer from "./common/containers/header"
import FooterContainer from "./common/containers/footer"
import { SearchParamsProvider } from "./search/search-params-ctx"
import { UserModalOpenProvider } from "./utils/user-login-modal-ctx"
import { useAnalytics } from "./utils/analytics"

import "../assets/email-header.png"

const Index = (): React.ReactElement => {
  useAnalytics()
  return (
    <Uploader>
      <SearchParamsProvider>
        <UserModalOpenProvider>
          <div className="sticky-content">
            <HeaderContainer />
            <AppRoutes />
          </div>
          <div className="sticky-footer">
            <FooterContainer />
          </div>
        </UserModalOpenProvider>
      </SearchParamsProvider>
    </Uploader>
  )
}

export default Index
