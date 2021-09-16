import React from 'react'

import { Header } from '../header/Header'
import { LandingExpandedHeader } from '../header/LandingExpandedHeader'
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

  const toggleLogin = () => alert('this is a context')
  const toggleSupport = () => setSupportIsOpen(prevIsOpen => !prevIsOpen)
  return (
    <>
      <article className={className}>
        <Header
          isOpenSupport={isOpenSupport}
          toggleLoginModal={toggleLogin}
          signOutAndRedirect={() => console.log('signed out')}
          toggleSupport={toggleSupport}
          profile={headerArgs.user}
          expanded={headerArgs.expanded}
          navigateToNewSearch={() => console.log('go to /search')}
          renderUploader={() => <li>Upload</li>}
          renderOnFreshDeskWidget={() => <>This is a freshdesk widget</>}
          renderOnExpanded={profile => (
            <LandingExpandedHeader
              user={profile}
              renderFacetSelect={() => <>front facet example</>}
              renderSearchInput={() => (
                <Input
                  placeholder="Search"
                  type="text"
                  name="front-page-search"
                  labelStyle="default"
                  label="search"
                  value=""
                  setValue={value => {}}
                />
              )}
              onSearch={() => console.log('User search by keyword.')}
            />
          )}
        />
        {children}
        <div className="on-foot">
          <Footer version="x.x.x" />
        </div>
      </article>
    </>
  )
}
