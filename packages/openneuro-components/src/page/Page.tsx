import React from 'react'

import { Header } from '../header/Header'
import { LandingExpandedHeader } from '../header/LandingExpandedHeader'
import { FrontFacetExample } from '../facets/Facet.stories'
import { Input } from '../input/Input'
import { Footer } from '../footer/Footer'

import './page.scss'
export interface PageProps {
  children: React.ReactNode
  headerArgs
  className?: string
}

export const Page = ({ children, headerArgs, className }: PageProps) => {
  const [isOpenSupport, setSupportIsOpen] = React.useState(false)
  const [isOpenUpload, setUploadIsOpen] = React.useState(false)
  const [isOpenLogin, setLoginIsOpen] = React.useState(false)
  const toggleLogin = () => setLoginIsOpen(prevIsOpen => !prevIsOpen)
  const toggleUpload = () => setUploadIsOpen(prevIsOpen => !prevIsOpen)
  const toggleSupport = () => setSupportIsOpen(prevIsOpen => !prevIsOpen)
  return (
    <>
      <article className={className}>
        <Header
          isOpenSupport={isOpenSupport}
          isOpenUpload={isOpenUpload}
          isOpenLogin={isOpenLogin}
          toggleLogin={toggleLogin}
          toggleSupport={toggleSupport}
          toggleUpload={toggleUpload}
          profile={headerArgs.user}
          onLogin={headerArgs.onLogin}
          onLogout={headerArgs.onLogout}
          onCreateAccount={headerArgs.onCreateAccount}
          expanded={headerArgs.expanded}
          renderOnFreshDeskWidget={() => <></>}
          renderOnExpanded={profile => (
            <LandingExpandedHeader
              profile={profile}
              renderFacetSelect={() => (
                <FrontFacetExample {...FrontFacetExample.args} />
              )}
              renderSearchInput={() => (
                <Input
                  placeholder="Search"
                  type="text"
                  name="front-page-search"
                  labelStyle="default"
                />
              )}
              onSearch={() => console.log('User search by keyword.')}
            />
          )}
        />
        {children}
        <div className="on-foot">
          <Footer />
        </div>
      </article>
    </>
  )
}
