import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import {
  SearchPage,
  SearchResultsList,
  FiltersBlock,
  sortBy,
  FacetSelect,
  FacetRadio,
  FacetRange,
  Button,
  FacetBlockContainerExample,
  SearchSortContainerExample,
  KeywordInputContainerExample,
} from '@openneuro/components'
import KeywordInput from './keyword-input'
import ModalitySelect from './modality-select'
import ShowDatasetRadios from './show-datasets-radios'
import AgeRangeInput from './age-range-input'
import SubjectCountRangeInput from './subject-count-range-input'
import DiagnosisSelect from './diagnosis-select'
import GenderRadios from './gender-radios'
import DateRangeInput from './date-range-input'
import SectionSelect from './section-select'
import StudyDomainSelect from './study-domain-select'

const SearchContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  return (
    <SearchPage
      renderFilterBlock={() => null}
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
          <h1>Filter Block Placeholder</h1>
          <ModalitySelect />
          <ShowDatasetRadios />
          <AgeRangeInput />
          <SubjectCountRangeInput />
          <DiagnosisSelect />
          <h1>Task Input Placeholder</h1>
          <h1>Author Input Placeholder</h1>
          <GenderRadios />
          <DateRangeInput />
          <h1>Species Input Placeholder</h1>
          <SectionSelect />
          <StudyDomainSelect />
        </>
      )}
      renderSearchResultsList={() => null}
    />
  )
}

export default SearchContainer
