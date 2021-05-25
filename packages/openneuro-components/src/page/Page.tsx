import React from 'react'

import { Header } from '../header/Header'
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
        />
        {children}
        <div className="on-foot">
          <Footer />
        </div>
      </article>
    </>
  )
}
