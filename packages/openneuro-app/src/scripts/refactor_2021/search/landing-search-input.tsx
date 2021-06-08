import React, { FC, useContext } from 'react'
import { Input } from '@openneuro/components'
import { SearchParamsCtx } from './search-params-ctx'

const LandingSearchInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const keyword = searchParams.keyword || ''
  const setKeyword = keyword => {
    setSearchParams(prevState => ({
      ...prevState,
      keyword,
    }))
  }

  return (
    <Input
      placeholder="Search"
      type="text"
      name="front-page-search"
      labelStyle="default"
      value={keyword}
      setValue={setKeyword}
    />
  )
}

export default LandingSearchInput
