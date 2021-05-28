import React from 'react'
import { ModalityHeader } from './ModalityHeader'
import { CommunitySwoop } from './CommunitySwoop'

import { FacetExample } from '../facets/Facet.stories'
import { SearchResults } from './SearchResults.stories'
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
          <div className="grid grid-start">
            <div className="col col-12">
              <h1>
                {portalContent ? 'Search MRI Portal' : 'Search all Dataset'}
              </h1>
            </div>

            <div className="col col-12">
              <div className="grid grid-between grid-nogutter">
                <div
                  className="col"
                  style={{
                    maxWidth: '500px',
                  }}></div>
                <div className="col  col-center results-count">
                  <b>
                    100 Datasets found for "<span>MRI</span>"
                  </b>
                </div>
                <div className="col col-center">
                  <div className="search-sort">
                    <SortBy {...SortBy.args} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col search-facet-wrapper">
              <FacetExample {...FacetExample.args} />
            </div>
            <div className="col">
              <SearchResults {...SearchResults.args} />
              <div className="col  col-center results-count">
                <b>
                  100 Datasets found for "<span>MRI</span>"
                </b>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
