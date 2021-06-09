import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import {
  SearchPage,
  sortBy,
  SearchSortContainerExample,
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
import SearchResultsContainer from './search-results-container'

const SearchContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  return (
    <SearchPage
      renderFilterBlock={() => <FiltersBlockContainer />}
      renderSortBy={() => (
        <>
          <div className="col">
            <b>
              100 Datasets found for "<span>Forrest Gump</span>"
            </b>
          </div>
          <div className="col">
            <div className="search-sort">
              <SearchSortContainerExample items={sortBy} />
            </div>
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
      renderSearchResultsList={() => <SearchResultsContainer />}
    />
  )
}

export default SearchContainer
