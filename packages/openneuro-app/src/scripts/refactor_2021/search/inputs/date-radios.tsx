import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetRadio } from '@openneuro/components/facets'

const DateRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { date_available, date_selected } = searchParams
  const setDate = date_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      date_selected,
    }))

  return (
    <FacetRadio
      selected={date_selected}
      setSelected={setDate}
      radioArr={date_available}
      layout="row"
      name="Date"
      startOpen={false}
      label="Publication Date"
      accordionStyle="plain"
      className="date-facet"
    />
  )
}

export default DateRadios
