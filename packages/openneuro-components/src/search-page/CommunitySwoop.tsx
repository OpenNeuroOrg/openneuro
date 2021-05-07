import React from 'react'

export interface CommunitySwoopProps {
  communityHeader: string
  communityPrimary: string
  communitySecondary: Record<string, any>
}

export const CommunitySwoop = ({
  communityHeader,
  communityPrimary,
  communitySecondary,
}: CommunitySwoopProps) => {
  return (
    <section className="search-page-coms">
      <div className="container">
        <div className="grid grid-start">
          <div className="col col-8">
            <h2>{communityHeader}</h2>
            <div className="primary-content">{communityPrimary}</div>
            <div className="secondary-content">{communitySecondary}</div>
          </div>
        </div>
      </div>
      <div className="search-swoop">
        <div></div>
      </div>
    </section>
  )
}
