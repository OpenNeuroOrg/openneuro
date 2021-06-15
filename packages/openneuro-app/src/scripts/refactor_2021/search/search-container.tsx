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
  DateRadios,
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
  console.log(numTotalResults)

  return (
    <SearchPage
      renderFilterBlock={() => (
        <FiltersBlockContainer numTotalResults={numTotalResults} />
      )}
      renderSortBy={() => (
        <>
          {/* TODO: move wrapper div.col.search-sort into <SearchSort/> */}
          <div className="col search-sort">
            <SortBySelect />
          </div>
        </>
      )}
      renderSearchFacets={() => (
        <>
          <KeywordInput />
          <ShowDatasetRadios />
          <ModalitySelect />
          <AgeRangeInput />
          <SubjectCountRangeInput />
          <DiagnosisSelect />
          <TaskInput />
          <AuthorInput />
          <GenderRadios />
          <DateRadios />
          <SpeciesSelect />
          <SectionSelect />
          <StudyDomainSelect />
        </>
      )}
      renderSearchResultsList={() =>
        loading ? (
          resultsList.length !== 0 && <>Datasets loading placeholder</>
        ) : (
          <>
            <SearchResultsList items={resultsList} profile={profile} />
            {/* TODO: make div below into display component. */}
            <div className="grid grid-nogutter" style={{ width: '100%' }}>
              {resultsList.length == 0 || resultsList.length < 25 ? null : (
                <div className="col col-12 load-more ">
                  <Button label="Load More" />
                </div>
              )}
            </div>
          </>
        )
      }
    />
  )
}

export default SearchContainer
