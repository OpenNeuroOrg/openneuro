import React, { FC, useContext } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { SearchParamsCtx } from '../search-params-ctx'
import { SearchParams, flattenedModalities } from '../initial-search-params'
import { FacetSelect } from '@openneuro/components/facets'
import { AccordionTab, AccordionWrap } from '@openneuro/components/accordion'

interface ModalitySelectProps {
  startOpen?: boolean
  label?: string
  portalStyles?: boolean
  dropdown?: boolean
}

const ModalitySelect: FC<ModalitySelectProps> = ({
  startOpen = true,
  label,
  portalStyles = false,
  dropdown,
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
    <>
      {portalStyles ? (
        <FacetSelect
          className="modality-facet facet-open"
          label={label}
          selected={modality_selected}
          setSelected={setModality}
          items={modality_available}
        />
      ) : (
        <AccordionWrap className="modality-facet facet-accordion">
          <AccordionTab
            accordionStyle="plain"
            label={label}
            startOpen={portalStyles ? startOpen : false}
            dropdown={dropdown}>
            <FacetSelect
              selected={modality_selected}
              setSelected={setModality}
              items={modality_available}
            />
          </AccordionTab>
        </AccordionWrap>
      )}
    </>
  )
}

export default ModalitySelect
