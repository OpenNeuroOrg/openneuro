import React from "react"

export interface CommunityHeaderProps {
  communityHeader: string
  communityPrimary: string
  communitySecondary: Record<string, object>
}

export const CommunityHeader = ({
  communityHeader,
  communityPrimary,
  communitySecondary,
}: CommunityHeaderProps) => {
  return (
    <section className="search-page-coms">
      <div className="container">
        <div className="grid grid-nogutter">
          <div className="col col-7">
            <h2>{communityHeader}</h2>
            <div className="primary-content">{communityPrimary}</div>
            <div className="secondary-content">{communitySecondary}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
