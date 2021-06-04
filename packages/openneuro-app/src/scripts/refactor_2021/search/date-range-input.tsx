import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
// import { FacetDatePicker } from '@openneuro/components'

const DateRangeInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const datePublicizedRange = searchParams.datePublicizedRange
  const setDatePublicizedRange = datePublicizedRange =>
    setSearchParams(prevState => ({
      ...prevState,
      datePublicizedRange,
    }))

  return (
    <h1>DateRangePicker Placeholder</h1>
    /* Throwing error: see openneuro-components/src/facets/index.ts for details. */
    // <FacetDatePicker
    //   startOpen={false}
    //   label="Date"
    //   accordionStyle="plain"
    //   selected={datePublicizedRange}
    //   setSelected={setDatePublicizedRange}
    // />
  )
}

export default DateRangeInput
