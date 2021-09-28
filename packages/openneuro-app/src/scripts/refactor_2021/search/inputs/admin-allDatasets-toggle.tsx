import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { Button } from '@openneuro/components/button'

const TaskInput: FC = () => {
  const {
    searchParams: { searchAllDatasets },
    setSearchParams
  } = useContext(SearchParamsCtx)

  const toggleSearchAllDatasets = () =>
    setSearchParams(prevState => ({
      ...prevState,
      searchAllDatasets: !prevState.searchAllDatasets,
    }))

  return (
    <Button
      className="toggle-btn active"
      onClick={toggleSearchAllDatasets}
      label={searchAllDatasets ? 'Searching All Datasets' : 'Search All Datasets'}>
    </Button>
  )
}

export default TaskInput
