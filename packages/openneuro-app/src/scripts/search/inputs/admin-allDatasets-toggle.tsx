import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { Button } from "@openneuro/components/button"
import styled from "@emotion/styled"

const StyledButton = styled(Button)`
  width: auto;
  padding: 6px 10px;
  margin-bottom: 20px;
  justify-content: flex-start;
  &.active {
    background: #fff5f3;
    border-color: #e68383;
    color: #710000;
    i {
      color: #710000;
    }
  }
`

const TaskInput: FC = () => {
  const {
    searchParams: { searchAllDatasets },
    setSearchParams,
  } = useContext(SearchParamsCtx)

  const toggleSearchAllDatasets = () =>
    setSearchParams((prevState) => ({
      ...prevState,
      searchAllDatasets: !prevState.searchAllDatasets,
    }))

  return (
    <StyledButton
      className={searchAllDatasets ? "active toggle-btn" : "toggle-btn"}
      onClick={toggleSearchAllDatasets}
      icon={searchAllDatasets ? "fas fa-check-square" : "far fa-square"}
      label={searchAllDatasets
        ? "Admin: Searching All Datasets"
        : "Admin: Search All Datasets"}
    >
    </StyledButton>
  )
}

export default TaskInput
