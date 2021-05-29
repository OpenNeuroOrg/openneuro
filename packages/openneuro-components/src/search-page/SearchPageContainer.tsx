import React from 'react'
import { FacetSelect } from '../facets/FacetSelect'
import { SearchResults } from './SearchResults'
import { FiltersBlock } from './FiltersBlock'
import { SearchPage } from './SearchPage'
import { SearchSortContainer } from './SearchSortContainer'

import { sortBy } from '../mock-content/sortby-list'
import { modalities } from '../mock-content/facet-content'

import './search-page.scss'

export interface SearchContainereProps {
  portalContent?: Record<string, any>
  searchResults
  profile?: Record<string, any>
}

export const SearchPageContainer = ({
  searchResults,
  portalContent,
  profile,
}: SearchContainereProps) => {
  return (
    <div>
      <SearchPage
        portalContent={portalContent}
        renderSortBy={() => (
          <>
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
                <SearchSortContainer items={sortBy} />
              </div>
            </div>
          </>
        )}
        renderSearchFacets={() => (
          <>
            <FiltersBlock />
            <FacetSelect
              items={modalities}
              accordionStyle="plain"
              label="Modalities"
              startOpen={true}
            />
          </>
        )}
        renderSearchResults={() => (
          <>
            <SearchResults items={searchResults} profile={profile} />
            <div className="col  col-center results-count">
              <b>
                100 Datasets found for "<span>MRI</span>"
              </b>
            </div>
          </>
        )}
      />
    </div>
  )
}
