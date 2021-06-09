import React, { FC } from 'react'
import {
  SearchPage,
  sortBy,
  SearchSortContainerExample,
  SearchResultsList,
  Button,
} from '@openneuro/components'
import {
  KeywordInput,
  ModalitySelect,
  ShowDatasetRadios,
  AgeRangeInput,
  SubjectCountRangeInput,
  DiagnosisSelect,
  TaskInput,
  AuthorInput,
  GenderRadios,
  DateRangeInput,
  SpeciesSelect,
  SectionSelect,
  StudyDomainSelect,
  SortBySelect,
} from './inputs'
import FiltersBlockContainer from './filters-block-container'
import { useCookies } from 'react-cookie'
import { getUnexpiredProfile } from '../authentication/profile'
import { useSearchResults } from './use-search-results'

const SearchContainer: FC = () => {
  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const { loading, data, fetchMore, refetch, variables, error } =
    useSearchResults()

  const numResultsShown = data?.datasets?.edges.length || 0
  const numTotalResults = data?.datasets?.pageInfo.count || 0
  const resultsList = data?.datasets?.edges || []

  return (
    <SearchPage
      renderFilterBlock={() => <FiltersBlockContainer />}
      renderSortBy={() => (
        <>
          {/* TODO: Make div.results-count into display component. */}
          <div className="col results-count">
            Showing <b>{numResultsShown}</b> of <b>{numTotalResults}</b>{' '}
            Datasets
          </div>
          {/* TODO: move wrapper div.col.search-sort into <SearchSort/> */}
          <div className="col search-sort">
            <SortBySelect />
          </div>
        </>
      )}
      renderSearchFacets={() => (
        <>
          <KeywordInput />
          <ModalitySelect />
          <ShowDatasetRadios />
          <AgeRangeInput />
          <SubjectCountRangeInput />
          <DiagnosisSelect />
          <TaskInput />
          <AuthorInput />
          <GenderRadios />
          <DateRangeInput />
          <SpeciesSelect />
          <SectionSelect />
          <StudyDomainSelect />
        </>
      )}
      renderSearchResultsList={() =>
        loading ? (
          <h1>Datasets loading placeholder</h1>
        ) : (
          <h1>
            <SearchResultsList items={resultsList} profile={profile} />
            {/* TODO: make div below into display component. */}
            <div className="grid grid-nogutter" style={{ width: '100%' }}>
              <div className="col col-12 results-count">
                Showing <b>{numResultsShown}</b> of <b>{numTotalResults}</b>{' '}
                Datasets
              </div>
              <div className="col col-12 load-more ">
                <Button label="Load More" />
              </div>
            </div>
          </h1>
        )
      }
    />
  )
}

export default SearchContainer
