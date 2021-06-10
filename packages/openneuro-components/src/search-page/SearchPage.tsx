import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunitySwoop } from './CommunitySwoop'
import { Link } from 'react-router-dom'

import './search-page.scss'

export interface SearchPageProps {
  portalContent?: Record<string, any>
  renderSearchFacets: () => React.ReactNode
  renderSearchResultsList: () => React.ReactNode
  renderSortBy: () => React.ReactNode
  renderFilterBlock: () => React.ReactNode
}

export const SearchPage = ({
  portalContent,
  renderSearchFacets,
  renderSearchResultsList,
  renderSortBy,
  renderFilterBlock,
}: SearchPageProps) => {
  interface IProps {
    children: React.ReactNode
    getScrollTop: (scrollTop: number) => void
    // Your other Props
  }
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
          <div className="grid grid-nogutter">
            <div className="col col-12 search-heading">
              <h1>
                {portalContent ? 'Search MRI Portal' : 'Search All Datasets'}
              </h1>
              {portalContent && (
                <Link className="go-back" to="/">
                  Choose Another Modality
                </Link>
              )}
            </div>

            <div className="col col-12 search-wrapper">
              <div className="search-nav search-facet-wrapper">
                {renderSearchFacets()}
              </div>
              <div className="search-content">
                <div className="grid grid-nogutter">
                  <div className="col col-12">{renderFilterBlock()}</div>
                  <div className="col col-12">
                    <div className="grid grid-nogutter">{renderSortBy()}</div>
                  </div>
                  {renderSearchResultsList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
