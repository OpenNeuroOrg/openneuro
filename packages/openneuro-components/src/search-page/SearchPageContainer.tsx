import React from 'react'
import { FacetBlockContainer } from './FacetBlockContainer'
import { SearchResults } from './SearchResults'
import { FiltersBlockContainer } from './FiltersBlockContainer'
import { SearchPage } from './SearchPage'
import { SearchSortContainer } from './SearchSortContainer'
import { KeywordInputContainer } from './KeywordInputContainer'
import { sortBy } from '../mock-content/sortby-list'

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
            <div className="col">
              <b>
                100 Datasets found for "<span>MRI</span>"
              </b>
            </div>
            <div className="col">
              <div className="search-sort">
                <SearchSortContainer items={sortBy} />
              </div>
            </div>
          </>
        )}
        renderSearchFacets={() => (
          <>
            <KeywordInputContainer />
            <FiltersBlockContainer />
            <FacetBlockContainer />
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
