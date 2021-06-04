import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import {
  SearchPage,
  SearchResults,
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

const SearchContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  return (
    <SearchPage
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
        </>
      )}
      renderSearchResults={() => null}
    />
  )
}

export default SearchContainer
