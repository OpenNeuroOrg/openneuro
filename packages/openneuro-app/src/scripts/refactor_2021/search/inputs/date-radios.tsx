import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetRadio } from '@openneuro/components'

const DateRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { date_available, date_selected } = searchParams
  const setGender = date_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      date_selected,
    }))

  return (
    <FacetRadio
      selected={date_selected}
      setSelected={setGender}
      radioArr={date_available}
      layout="row"
      name="Date"
      startOpen={false}
      label="Publication Date"
      accordionStyle="plain"
    />
  )
}

export default DateRadios
