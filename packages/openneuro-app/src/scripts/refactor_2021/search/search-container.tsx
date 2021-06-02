import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'

const SearchContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  return (
    <>
      <h1>Search Container Placeholder</h1>
      <code>{JSON.stringify(searchParams)}</code>
    </>
  )
}

export default SearchContainer
