import React, { FC, useContext } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { SearchParamsCtx } from '../search-params-ctx'
import { SearchParams, flattenedModalities } from '../initial-search-params'
import { FacetSelect } from '@openneuro/components'

interface ModalitySelectProps {
  startOpen?: boolean
  label?: string
  portalStyles?: boolean
}

const ModalitySelect: FC<ModalitySelectProps> = ({
  startOpen = true,
  label = 'Modalities',
  portalStyles = false,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const { path } = useRouteMatch()
  const history = useHistory()

  const { modality_available, modality_selected } = searchParams
  const setModality = (
    modality_selected: string,
  ): ReturnType<typeof setSearchParams> => {
    setSearchParams(
      (prevState: SearchParams): SearchParams => ({
        ...prevState,
        modality_selected,
      }),
    )
    const modality_selected_path = flattenedModalities.find(modality => {
      return modality.label === modality_selected
    })?.portalPath
    history.push(modality_selected_path)
  }

  return (
    <FacetSelect
      selected={modality_selected}
      setSelected={setModality}
      items={modality_available}
      accordionStyle="plain"
      label={label}
      startOpen={startOpen}
      className={portalStyles ? 'modality-facet' : ''}
      noAccordion={portalStyles}
    />
  )
}

export default ModalitySelect
