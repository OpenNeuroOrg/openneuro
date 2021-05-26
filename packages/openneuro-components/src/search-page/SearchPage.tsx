import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunitySwoop } from './CommunitySwoop'

import { FacetExample } from '../facets/Facet.stories'
import { SortBy } from './SearchSort.stories'
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
              <div className="col col-4">
                <FacetExample {...FacetExample.args} />
              </div>
              <div className="col col-8">
                <div className="search-sort">
                  <SortBy {...SortBy.args} />
                </div>
                results todo
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
