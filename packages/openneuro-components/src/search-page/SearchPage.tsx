import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunitySwoop } from './CommunitySwoop'
import './search-page.scss'

export interface SearchPageProps {
  content?: Record<string, any>
}

export const SearchPage = ({ content }: SearchPageProps) => {
  return (
    <>
      <div className="page">
        {content ? (
          <>
            {content.portalName ? (
              <ModalityHeader
                portalName={content.portalName}
                portalPrimary={content.portalPrimary}
                publicDatasetStat={content.publicDatasetStat}
                participantsStat={content.participantsStat}
                hexBackgroundImage={content.hexBackgroundImage}
                swoopBackgroundColorLight={content.swoopBackgroundColorLight}
                swoopBackgroundColorDark={content.swoopBackgroundColorDark}
              />
            ) : null}
            {content.communityHeader ? (
              <CommunitySwoop
                communityHeader={content.communityHeader}
                communityPrimary={content.communityPrimary}
                communitySecondary={content.communitySecondary}
              />
            ) : null}
          </>
        ) : null}

        <section className="search">
          <div className="container">
            <div className="grid grid-start">
              <div className="col col-4">facets</div>
              <div className="col col-8">results</div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
