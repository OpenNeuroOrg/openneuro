import React, { FC, useContext, useEffect } from 'react'
import {
  SearchPage,
  sortBy,
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
import { SearchParamsCtx } from './search-params-ctx'
import { SearchParams } from './initial-search-params'

export interface SearchContainerProps {
  portalContent?: Record<string, any>
}

const SearchContainer: FC<SearchContainerProps> = ({ portalContent }) => {
  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)

  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const modality = portalContent?.modality || false
  useEffect(() => {
    if (searchParams.modality_selected !== modality) {
      setSearchParams(
        (prevState: SearchParams): SearchParams => ({
          ...prevState,
          modality_selected: modality,
        }),
      )
    }
  }, [modality, searchParams.modality_selected, setSearchParams])

  let loading, data
  // const { loading, data, fetchMore, refetch, variables, error } =
  //   useSearchResults()

  const numResultsShown = data?.datasets?.edges.length || 0
  const numTotalResults = data?.datasets?.pageInfo.count || 0
  const resultsList = data?.datasets?.edges || []

  return (
    <SearchPage
      portalContent={portalContent}
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
      renderSearchHeader={() => (
        <>
          {portalContent
            ? 'Search ' + modality + ' Portal'
            : 'Search All Datasets'}
        </>
      )}
      renderSearchFacets={() => (
        <>
          <KeywordInput />
          <ShowDatasetRadios />
          {!portalContent ? (
            <ModalitySelect portalStyles={true} />
          ) : (
            <ModalitySelect portalStyles={false} />
          )}
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
        loading && numTotalResults === 0 ? (
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
