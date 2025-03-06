import React, { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchParamsCtx } from "../search-params-ctx"
import { flattenedModalities } from "../initial-search-params"
import { FacetSelect } from "@openneuro/components/facets"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

interface ModalitySelectProps {
  inHeader?: boolean
  startOpen?: boolean
  label?: string
  portalStyles?: boolean
  dropdown?: boolean
}

const ModalitySelect: React.FC<ModalitySelectProps> = ({
  startOpen = true,
  label,
  portalStyles = false,
  dropdown,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const navigate = useNavigate()
  const location = useLocation()

  const setModality = (modality_selected: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      modality_selected,
    }))

    const modality_selected_path = flattenedModalities.find(
      (modality) => modality.value === modality_selected,
    )?.portalPath

    const currentParams = new URLSearchParams(location.search)
    currentParams.set("modality_selected", modality_selected)
    const newQueryString = currentParams.toString()

    navigate({
      pathname: modality_selected_path,
      search: newQueryString ? `?${newQueryString}` : "",
    })
  }

  return (
    <>
      {portalStyles
        ? (
          <FacetSelect
            className="modality-facet facet-open"
            label={label}
            selected={searchParams.modality_selected}
            setSelected={setModality}
            items={searchParams.modality_available}
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
                selected={searchParams.modality_selected}
                setSelected={setModality}
                items={searchParams.modality_available}
              />
            </AccordionTab>
          </AccordionWrap>
        )}
    </>
  )
}

export default ModalitySelect
