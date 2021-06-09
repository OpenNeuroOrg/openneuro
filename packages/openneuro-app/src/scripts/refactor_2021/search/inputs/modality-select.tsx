import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetSelect } from '@openneuro/components'

const ModalitySelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { modality_available, modality_selected } = searchParams
  const setModality = modality_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      modality_selected,
    }))

  return (
    <FacetSelect
      selected={modality_selected}
      setSelected={setModality}
      items={modality_available}
      accordionStyle="plain"
      label="Modalities"
      startOpen={true}
      className="modality-facet"
      noAccordion={true}
    />
  )
}

export default ModalitySelect
