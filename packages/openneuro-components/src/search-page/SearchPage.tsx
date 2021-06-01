import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunitySwoop } from './CommunitySwoop'

import { FacetExample } from '../facets/Facet.stories'
import { SearchResults } from './SearchResults.stories'
import { SortBy } from './SearchSort.stories'
import './search-page.scss'

export interface SearchPageProps {
  portalContent?: Record<string, any>
  renderSearchFacets: () => React.ReactNode
  renderSearchResults: () => React.ReactNode
  renderSortBy: () => React.ReactNode
}

export const SearchPage = ({
  portalContent,
  renderSearchFacets,
  renderSearchResults,
  renderSortBy,
}: SearchPageProps) => {
  return (
    <>
      <section className="search">
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
        <div className="container">
          <div className="grid grid-start">
            <div className="col col-12">
              <h1>
                {portalContent ? 'Search MRI Portal' : 'Search all Dataset'}
              </h1>
            </div>

            <div className="col col-12">
              <div className="grid grid-between grid-nogutter">
                {renderSortBy()}
              </div>
            </div>
            <div className="col search-facet-wrapper">
              {renderSearchFacets()}
            </div>
            <div className="col">{renderSearchResults()}</div>
          </div>
        </div>
      </section>
    </>
  )
}
