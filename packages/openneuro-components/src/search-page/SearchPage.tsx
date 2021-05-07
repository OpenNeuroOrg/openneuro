import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunitySwoop } from './CommunitySwoop'
import './search-page.scss'

export interface SearchPageProps {
  portalContent?: Record<string, any>
}

export const SearchPage = ({ portalContent }: SearchPageProps) => {
  return (
    <>
      <div className="page">
        {portalContent ? (
          <>
            {portalContent.portalName ? (
              <ModalityHeader
                portalName={portalContent.portalName}
                portalPrimary={portalContent.portalPrimary}
                publicDatasetStat={portalContent.publicDatasetStat}
                participantsStat={portalContent.participantsStat}
                hexBackgroundImage={portalContent.hexBackgroundImage}
                swoopBackgroundColorLight={
                  portalContent.swoopBackgroundColorLight
                }
                swoopBackgroundColorDark={
                  portalContent.swoopBackgroundColorDark
                }
              />
            ) : null}
            {portalContent.communityHeader ? (
              <CommunitySwoop
                communityHeader={portalContent.communityHeader}
                communityPrimary={portalContent.communityPrimary}
                communitySecondary={portalContent.communitySecondary}
              />
            ) : null}
          </>
        ) : null}

        <section className="search">
          <div className="container">
            <div className="grid grid-start">
              <div className="col col-4">facets Todo</div>
              <div className="col col-8">results todo</div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
