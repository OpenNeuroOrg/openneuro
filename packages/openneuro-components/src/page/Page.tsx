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
  return (
    <>
      <article className={className}>
        <Header
          user={headerArgs.user}
          onLogin={headerArgs.onLogin}
          onLogout={headerArgs.onLogout}
          onCreateAccount={headerArgs.onCreateAccount}
          expanded={headerArgs.expanded}
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
