import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import { Input } from '@openneuro/components'

const KeywordInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const keyword = searchParams.keyword
  const setKeyword = keyword =>
    setSearchParams(prevState => ({
      ...prevState,
      keyword,
    }))

  return (
    <div className="search-keyword">
      <Input
        type="search"
        label="Keyword"
        placeholder="eg. something here"
        labelStyle="default"
        name="default-example"
        value={keyword}
        setValue={setKeyword}
      />
    </div>
  )
}

export default KeywordInput
