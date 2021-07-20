import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { SearchSort } from '@openneuro/components/search-page'

const SortBySelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { sortBy_available, sortBy_selected } = searchParams
  const setSortBy = sortBy_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      sortBy_selected,
    }))

  return (
    <SearchSort
      items={sortBy_available}
      selected={sortBy_selected}
      setSelected={setSortBy}
    />
  )
}

export default SortBySelect
