import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetSelect } from '@openneuro/components'

const DiagnosisSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { diagnosis_available, diagnosis_selected } = searchParams
  const setDiagnosis = diagnosis_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      diagnosis_selected,
    }))

  return (
    <FacetSelect
      selected={diagnosis_selected}
      setSelected={setDiagnosis}
      items={diagnosis_available}
      accordionStyle="plain"
      label="Diagnosis"
      startOpen={false}
    />
  )
}

export default DiagnosisSelect
