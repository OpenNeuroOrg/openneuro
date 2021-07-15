import React, { FC, useContext } from 'react'
import useState from 'react-usestateref'
import { SearchParamsCtx, removeFilterItem } from '../../search-params-ctx'
import { FacetSearch, Icon } from '@openneuro/components'

const ScannerManufacturersInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const scannerManufacturers = searchParams.scannerManufacturers

  const [newInput, setNewInput, newInputRef] = useState('')

  const addScannerManufacturer = () => {
    setSearchParams(prevState => ({
      ...prevState,
      scannerManufacturers: [...scannerManufacturers, newInputRef.current],
    }))
    setNewInput('')
  }

  return (
    <FacetSearch
      accordionStyle="plain"
      label="Scanner Manufacturer"
      startOpen={false}
      className="search-authors"
      type="text"
      placeholder="Enter Scanner Manufacturer(s) to Search"
      labelStyle="default"
      name="scannerManufacturers"
      termValue={newInput}
      setTermValue={setNewInput}
      primary={true}
      color="#fff"
      icon="fas fa-plus"
      iconSize="20px"
      size="small"
      pushTerm={addScannerManufacturer}
      allTerms={scannerManufacturers}
      removeFilterItem={removeFilterItem(setSearchParams)}
      helpText={
        <span>
          Each time the <Icon icon="fas fa-plus" label="plus" iconOnly={true} />{' '}
          button is clicked, it will add a search filter. Multiple words in a
          filter will return results containing any or all words. For advanced
          filters use the{' '}
          <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#simple-query-string-syntax">
            simple query string syntax
          </a>
          .
        </span>
      }
    />
  )
}

export default ScannerManufacturersInput
