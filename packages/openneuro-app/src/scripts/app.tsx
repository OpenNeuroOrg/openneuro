import React, { FC, ReactNode } from "react"
import Helmet from "react-helmet"
import { frontPage } from "./pages/front-page/front-page-content"
import { Cookies, CookiesProvider } from "react-cookie"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MediaContextProvider } from "./styles/media"
import { Agreement } from "./components/agreement"
import { LocalStorageProvider } from "./utils/local-storage"

interface AppProps {
  children: ReactNode
  cookies?: Cookies
}

const App: FC<AppProps> = ({
  children,
  cookies,
}: {
  cookies?: Cookies
  children: ReactNode
}) => {
  return (
    <LocalStorageProvider defaultValue={{ agreement: false }}>
      <CookiesProvider cookies={cookies}>
        <MediaContextProvider>
          <Helmet>
            <title>{frontPage.pageTitle}</title>
            <meta name="description" content={frontPage.pageDescription} />
          </Helmet>
          {children}
          <Agreement />
          <ToastContainer position="bottom-right" />
        </MediaContextProvider>
      </CookiesProvider>
    </LocalStorageProvider>
  )
}

export default App
