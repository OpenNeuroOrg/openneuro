import React, { useContext } from "react"
import type { FC } from "react"
import { useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { flattenedModalities } from "../initial-search-params"
import type { SearchParams } from "../initial-search-params"
import { FacetSelect } from "@openneuro/components/facets"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"
import initialSearchParams from "../initial-search-params"

interface ModalitySelectProps {
  inHeader?: boolean
  startOpen?: boolean
  label?: string
  portalStyles?: boolean
  dropdown?: boolean
}

const ModalitySelect: FC<ModalitySelectProps> = ({
  inHeader = false,
  startOpen = true,
  label,
  portalStyles = false,
  dropdown,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()

  const { modality_available, modality_selected } = searchParams
  const setModality = (
    modality_selected: string,
  ): ReturnType<typeof setSearchParams> => {
    setSearchParams(
      (prevState: SearchParams): SearchParams => ({
        ...(inHeader ? initialSearchParams : prevState),
        modality_selected,
      }),
    )
    const modality_selected_path = flattenedModalities.find((modality) => {
      return modality.value === modality_selected
    })?.portalPath
    navigate(modality_selected_path)
  }

  return (
    <>
      {portalStyles
        ? (
          <FacetSelect
            className="modality-facet facet-open"
            label={label}
            selected={modality_selected}
            setSelected={setModality}
            items={modality_available}
          />
        )
        : (
          <AccordionWrap className="modality-facet facet-accordion">
            <AccordionTab
              accordionStyle="plain"
              label={label}
              startOpen={portalStyles ? startOpen : false}
              dropdown={dropdown}
            >
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
