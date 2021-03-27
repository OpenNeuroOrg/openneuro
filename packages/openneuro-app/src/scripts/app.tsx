import React, { FC, ReactNode } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { frontPage } from './front-page/front-page-content'
import { CookiesProvider, Cookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import { MediaContextProvider } from './styles/media'
import { OpenNeuroConfig } from './config'

const App: FC = ({
  config,
  cookies,
  children,
}: {
  config: OpenNeuroConfig
  cookies?: Cookies
  children: ReactNode
}) => {
  return (
    <CookiesProvider cookies={cookies}>
      <MediaContextProvider>
        <Helmet>
          <title>{frontPage.pageTitle}</title>
          <meta name="description" content={frontPage.pageDescription} />
        </Helmet>
        {children}
        <ToastContainer position="bottom-right" />
      </MediaContextProvider>
    </CookiesProvider>
  )
}

App.propTypes = {
  config: PropTypes.object,
}

export default App
