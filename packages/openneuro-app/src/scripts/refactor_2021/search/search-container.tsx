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

  return (
    <SearchPage
      renderFilterBlock={() => <FiltersBlockContainer />}
      renderSortBy={() => (
        <>
          <div className="col results-count">
            Showing <b>25</b> of <b>100</b> Datasets
          </div>
          <div className="col search-sort">
            <SearchSortContainerExample items={sortBy} />
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
            <SearchResultsList items={data?.datasets.edges} profile={profile} />
            <div className="grid grid-nogutter" style={{ width: '100%' }}>
              <div className="col col-12 results-count">
                Showing <b>{data.datasets.pageInfo.count}</b> of{' '}
                <b>[NUM_PLACEHOLDER]</b> Datasets
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
