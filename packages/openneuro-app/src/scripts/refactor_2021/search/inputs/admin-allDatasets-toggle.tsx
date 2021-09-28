import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { Button } from '@openneuro/components/button'
import styled from '@emotion/styled'

const StyledButton = styled(Button)`
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 20px;
`

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
    <StyledButton
      className="toggle-btn active"
      onClick={toggleSearchAllDatasets}
      label={searchAllDatasets 
        ? 'Admin: Searching All Datasets' 
        : 'Admin: Search All Datasets'
      }
    >
    </StyledButton>
  )
}

export default TaskInput
